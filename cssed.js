import { TYPE_REGEX } from './regex.js'

export function render (element, markup) {
    try {
        let parsed = parseCSSSyntax(markup)
        let ast = parseToAST(parsed)

        renderAST(element, ast)
        renderCSS(markup)
    } catch (error) {
        displayError('failed to render', error.message)
    }
}

function parseCSSSyntax (markup) {
    const doc = document.implementation.createHTMLDocument("")
    const style = document.createElement("style");

    style.textContent = markup;
    doc.body.appendChild(style);

    return style.sheet.cssRules;
}

function parseToAST (parsed) {
    const root = createVirtualElement('root', 'main', '')

    for (const pars of parsed) {
        let current = root

        let name = ''
        let type = 'div'
        let content = ''

        if (pars.style.content) {
            content = pars.style.content.slice(1, -1)
        }

        const els = pars.selectorText.trim().split(' ')

        if (els.length > 1) {
            for (const el of els) {
                const match = el.match(TYPE_REGEX)

                if (match && match[0]) {
                    type = match[0].slice(1, -1)
                }

                const name = el.split('[')[0].slice(1)

                console.log('name', name)
                console.log('current', Object.assign({}, current))

                if (name) {
                    const parent = current.children.find(child => child.name === name)

                    if (parent) {
                        current = parent
                        console.log('current changed', Object.assign({}, current))
                    }
                }
            }

            name = els[els.length - 1].split('[')[0].slice(1)
            current.children.push(createVirtualElement(name, type, content))
        } else {
            name = els[0].split('[')[0].slice(1)
            current.children.push(createVirtualElement(name, type, content))
        }
    }

    return root
}

function createVirtualElement (name, type, content) {
    return {
        name,
        type,
        content,
        children: []
    }
}

function renderAST (parent, ast) {
    const element = document.createElement(ast.type)
    element.classList.add(ast.name)

    if (ast.content) {
        element.innerHTML = ast.content
    }

    parent.appendChild(element)

    for (const child of ast.children) {
        renderAST(element, child)
    }
}

function renderCSS (markup) {
    const style = document.createElement('style');
    style.innerHTML = markup;
    document.head.appendChild(style);

    for (const rule of style.sheet.cssRules) {
        rule.selectorText = rule.selectorText.trim().replaceAll(TYPE_REGEX, '')
    }

    return style.sheet.cssRules;
}

function displayError (title, message) {
    render(
        document.body,
        `
        .wrapper[div] {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 600px;
            height: 400px;
            padding: 20px;   
        }
        .wrapper .title[h1] {
            content: "${title}";
        }
        .wrapper .message[p] {
            content: "${message}";
        }
        `
    )
}