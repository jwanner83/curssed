class CurssedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CurssedError';
    }
}

class InputHandler {
    /**
     * Reads the input options and returns the content.
     * @param input
     */
    async resolveContent(input) {
        if (input.content && input.file) {
            throw new CurssedError('you can only provide either a content or a file input and not both at the same time.');
        }
        if (input.file) {
            return InputHandler.readFile(input.file);
        }
        else {
            return input.content;
        }
    }
    /**
     * Reads the file and returns the content.
     * @param file
     * @private
     */
    static async readFile(file) {
        const response = await fetch(file);
        if (!response.ok) {
            throw new CurssedError(`could not read file '${file}'. make sure that you've written the correct name and it is available publicly.`);
        }
        return await response.text();
    }
}

class AST {
    name;
    type;
    content;
    attributes;
    children;
    constructor(name, type = 'div', content = '', attributes = new Map()) {
        this.name = name;
        this.type = type;
        this.content = content;
        this.attributes = attributes;
        this.children = [];
    }
    /**
     * Create empty AST node.
     */
    static createEmpty() {
        return new AST('');
    }
    /**
     * Set the content of the node.
     * @param rule
     */
    setContent(rule) {
        this.content = rule.style.content.slice(1, -1);
    }
}

class ASTHandler {
    /**
     * Regex to get the arguments of a selector.
     * @private
     */
    static ARGUMENT_REGEX = /\[.*]/g;
    /**
     * Reads the input options and returns the content.
     * @param rules
     */
    resolveAST(rules) {
        const ast = new AST('#root', 'main');
        for (const rule of Array.from(rules)) {
            if (ASTHandler.isIgnorableSelector(rule.selectorText)) {
                continue;
            }
            let current = ast;
            const child = AST.createEmpty();
            if (rule.style.content) {
                child.setContent(rule);
            }
            const elements = ASTHandler.getElementsFromSelector(rule.selectorText);
            elements.forEach((element, index) => {
                const name = ASTHandler.getName(element);
                if (index === elements.length - 1) {
                    child.attributes = ASTHandler.getAttributes(element);
                    child.type = ASTHandler.getType(element);
                }
                else {
                    const parent = current.children.find(child => child.name === name);
                    if (parent) {
                        current = parent;
                    }
                    else {
                        throw new CurssedError(`the parent '${element}' was not found on line '${rule.selectorText}'. remember that the parent always has to be defined to be able to add a child to it.`);
                    }
                }
            });
            child.name = ASTHandler.getName(elements[elements.length - 1]);
            current.children.push(child);
        }
        return ast;
    }
    /**
     * Convert the whole AST to an HTML nodes.
     * @param ast
     */
    convertASTToNode(ast) {
        return ASTHandler.getNodeFromAST(ast);
    }
    /**
     * Get an HTML node from an AST object.
     * @param ast
     * @private
     */
    static getNodeFromAST(ast) {
        const node = document.createElement(ast.type);
        if (ast.name.startsWith('#')) {
            node.id = ast.name.slice(1);
        }
        else if (ast.name.startsWith('.')) {
            node.classList.add(ast.name.slice(1));
        }
        if (ast.content) {
            node.innerHTML = ast.content;
        }
        if (ast.attributes) {
            for (const [key, value] of ast.attributes) {
                node.setAttribute(key, value);
            }
        }
        if (ast.children) {
            for (const child of ast.children) {
                node.appendChild(ASTHandler.getNodeFromAST(child));
            }
        }
        return node;
    }
    /**
     * Checks if the selector is ignorable.
     * @deprecated add custom css with the additional CurssedRenderOptions.css property.
     * @param selector
     * @private
     */
    static isIgnorableSelector(selector) {
        return selector === 'body' || selector === 'html' || selector === '#root';
    }
    /**
     * Get the elements from the selector.
     * @param selector
     * @private
     */
    static getElementsFromSelector(selector) {
        return selector.trim().split(' ');
    }
    static getName(element) {
        return element.split('[')[0].trim();
    }
    /**
   * Get the type of the element.
   * @param element
   * @private
   */
    static getType(element) {
        const match = element.match(ASTHandler.ARGUMENT_REGEX);
        if (match && match[0]) {
            return match[0].split(']')[0].slice(1);
        }
        else {
            return 'div';
        }
    }
    /**
     * Get the attributes from the element.
     * @param element
     * @private
     */
    static getAttributes(element) {
        const attributes = new Map();
        const match = element.match(ASTHandler.ARGUMENT_REGEX);
        if (match && match[0]) {
            const split = match[0].split(']');
            split.shift();
            for (const value of split) {
                if (value) {
                    const attribute = value.slice(1).split('=');
                    attributes.set(attribute[0], attribute[1].slice(1, -1));
                }
            }
        }
        return attributes;
    }
}

class StyleHandler {
    /**
     * Virtual document to create style nodes.
     * @private
     */
    virtual;
    constructor() {
        this.virtual = document.implementation.createHTMLDocument('');
    }
    /**
     * Reads the input options and returns the content.
     * @param css
     */
    getRules(css) {
        const style = document.createElement('style');
        style.textContent = css;
        this.virtual.body.appendChild(style);
        return style.sheet.cssRules;
    }
    /**
     * Get a style node from the given string.
     * @param css
     */
    renderCSS(css) {
        let edited = '' + css;
        const temp = document.createElement('style');
        temp.innerHTML = css;
        this.virtual.head.appendChild(temp);
        for (const rule of Array.from(temp.sheet.cssRules)) {
            edited = edited.replace(rule.selectorText, StyleHandler.getCleanedSelector(rule.selectorText));
        }
        const style = document.createElement('style');
        style.innerHTML = edited;
        return style;
    }
    /**
     * Get a clean selector from the given string.
     * @param selector
     * @private
     */
    static getCleanedSelector(selector) {
        return selector.trim().replaceAll(ASTHandler.ARGUMENT_REGEX, '');
    }
}

class ErrorHandler {
    /**
     * The default error message title
     * @private
     */
    static DEFAULT_TITLE = 'failed to render';
    /**
     * Displays an error message.
     * @param title
     * @param message
     */
    displayError(message, title = ErrorHandler.DEFAULT_TITLE) {
        render(document.body, {
            markup: {
                content: `
            .wrapper[div] {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;   
            }
            
            .wrapper .content {
                width: 600px;
                padding: 30px 30px 26px;
                border: 3px solid red;
                border-radius: 5px;
                background: #fff5f5;
                font-family: monospace;
            }
            
            .wrapper .content .title[h1] {
                color: red;
                margin-top: 8px;
                content: "${ErrorHandler.getValidContent(title)}";
            }
            
            .wrapper .content .message[p] {
                color: #ff6565;
                margin-bottom: 0;
                line-height: 24px;
                content: "${ErrorHandler.getValidContent(message)}";
            }
            `
            }
        }).then();
    }
    /**
     * Get a valid content
     * @param message
     * @private
     */
    static getValidContent(message) {
        return message.replaceAll('"', '\\"');
    }
}

async function render(element, options) {
    const errorHandler = new ErrorHandler();
    const inputHandler = new InputHandler();
    const styleHandler = new StyleHandler();
    const astHandler = new ASTHandler();
    try {
        const markup = await inputHandler.resolveContent(options.markup);
        const curssed = styleHandler.getRules(markup);
        const ast = astHandler.resolveAST(curssed);
        const node = astHandler.convertASTToNode(ast);
        document.head.appendChild(styleHandler.renderCSS(markup));
        if (options.css) {
            const css = await inputHandler.resolveContent(options.css);
            document.head.appendChild(styleHandler.renderCSS(css));
        }
        element.appendChild(node);
    }
    catch (error) {
        errorHandler.displayError(error.message);
    }
}

export { render };
