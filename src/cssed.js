import { ARGUMENT_REGEX } from './regex.js'

export function render(element, markup) {
    try {
        let parsed = parseCSSSyntax(markup)
        let ast = parseToAST(parsed)

        renderAST(element, ast)
        renderCSS(markup)
    } catch (error) {
        displayError('failed to render', error.message)
    }
}

export async function renderFile (element, file) {
    const response = await fetch(file)

    if (response.ok) {
        const markup = await response.text()

        render(element, markup)
    } else {
        displayError('failed to fetch', `failed to fetch the input file with the name '${file}'. make sure it exists.`)
    }
}

function parseCSSSyntax(markup) {
    const doc = document.implementation.createHTMLDocument("")
    const style = document.createElement("style");

    style.textContent = markup;
    doc.body.appendChild(style);

    return style.sheet.cssRules;
}

function parseToAST(parsed) {
    const root = createASTObject('#root', 'main', new Map(), '')

    for (const pars of parsed) {
        if (pars.selectorText === 'body' || pars.selectorText === 'html' || pars.selectorText === '#root') {
            continue
        }

        let current = root

        let name = ''
        let type = 'div'
        let attributes = new Map()
        let content = ''

        if (pars.style.content) {
            content = pars.style.content.slice(1, -1)
        }

        const els = pars.selectorText.trim().split(' ')

        els.forEach((el, index) => {
            const argumentMatch = el.match(ARGUMENT_REGEX)

            if (argumentMatch && argumentMatch[0]) {
                const split = argumentMatch[0].split(']')

                split.forEach((match, index) => {
                    if (match) {
                        if (index === 0) {
                            type = match.slice(1)
                        } else {
                            const attribute = match.slice(1).split('=')
                            attributes.set(attribute[0], attribute[1].slice(1, -1))
                        }
                    }
                })
            }

            name = getName(el)

            if (index < els.length - 1) {
                if (name) {
                    const parent = current.children.find(child => child.name === name)

                    if (parent) {
                        current = parent
                    } else {
                        throw Error(`the parent '${el}' not found on line '${pars.selectorText}'. remember that the parent always has to be defined to be able to add a child to it.`)
                    }
                } else {
                    throw Error(`failed to get name of '${el}' on line '${pars.selectorText}'.`)
                }
            }
        })

        name = getName(els[els.length - 1])
        current.children.push(createASTObject(name, type, attributes, content))
    }

    return root
}

function getName(selectorText) {
    return selectorText.split('[')[0].trim()
}

function createASTObject(name, type, attributes, content) {
    return {
        name,
        type,
        content,
        attributes,
        children: []
    }
}

function renderAST(parent, ast) {
    const element = document.createElement(ast.type)

    if (ast.name.startsWith('#')) {
        element.id = ast.name.slice(1)
    } else {
        element.classList.add(ast.name.slice(1))
    }

    if (ast.attributes && ast.attributes.size > 0) {
        for (const attribute of ast.attributes) {
            element.setAttribute(attribute[0], attribute[1])
        }
    }

    if (ast.content) {
        element.innerHTML = ast.content
    }

    parent.appendChild(element)

    for (const child of ast.children) {
        renderAST(element, child)
    }
}

function renderCSS(markup) {
    const style = document.createElement('style');
    style.innerHTML = markup;
    document.head.appendChild(style);

    for (const rule of style.sheet.cssRules) {
        rule.selectorText = rule.selectorText.trim().replaceAll(ARGUMENT_REGEX, '')
    }

    return style.sheet.cssRules;
}

function displayError(title, message) {
    render(
        document.body,
        `
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
            content: "${title}";
        }
        
        .wrapper .content .message[p] {
            color: #ff6565;
            margin-bottom: 0;
            line-height: 24px;
            content: "${message}";
        }
        `
    )
}
