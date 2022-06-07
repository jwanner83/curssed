import CurssedError from '../exceptions/CurssedError'
import ASTHandler from '../interfaces/ASTHandler'
import AST from '../models/AST'

export default class ASTHandlerRuntime implements ASTHandler {
  public static ARGUMENT_REGEX = /\[.*]/g

  public resolveAST(rules: CSSRuleList): AST {
    const ast = new AST('#root', 'main')

    for (const rule of Array.from(rules) as CSSStyleRule[]) {
      if (ASTHandlerRuntime.isIgnorableSelector(rule.selectorText)) {
        continue
      }

      let current = ast
      const child = AST.createEmpty()

      if (rule.style.content) {
        child.setContent(rule)
      }

      const elements = ASTHandlerRuntime.getElementsFromSelector(
        rule.selectorText
      )

      elements.forEach((element, index) => {
        const name = ASTHandlerRuntime.getName(element)

        if (index === elements.length - 1) {
          child.attributes = ASTHandlerRuntime.getAttributes(element)
          child.type = ASTHandlerRuntime.getType(element)
        } else {
          const parent = current.children.find((child) => child.name === name)

          if (parent) {
            current = parent
          } else {
            throw new CurssedError(
              `the parent '${element}' was not found on line '${rule.selectorText}'. remember that the parent always has to be defined to be able to add a child to it.`
            )
          }
        }
      })

      child.name = ASTHandlerRuntime.getName(elements[elements.length - 1])
      current.children.push(child)
    }

    return ast
  }

  /**
   * Convert the whole AST to an HTML nodes.
   * @param ast
   */
  public convertASTToNode(ast: AST): HTMLElement {
    return ASTHandlerRuntime.getNodeFromAST(ast)
  }

  /**
   * Get an HTML node from an AST object.
   * @param ast
   * @private
   */
  private static getNodeFromAST(ast: AST): HTMLElement {
    const node = document.createElement(ast.type)

    if (ast.name.startsWith('#')) {
      node.id = ast.name.slice(1)
    } else if (ast.name.startsWith('.')) {
      node.classList.add(ast.name.slice(1))
    }

    if (ast.content) {
      node.innerHTML = ast.content
    }

    if (ast.attributes) {
      for (const [key, value] of ast.attributes) {
        node.setAttribute(key, value)
      }
    }

    if (ast.children) {
      for (const child of ast.children) {
        node.appendChild(ASTHandlerRuntime.getNodeFromAST(child))
      }
    }

    return node
  }

  /**
   * Checks if the selector is ignorable.
   * @deprecated add custom css with the additional CurssedRenderOptions.css property.
   * @param selector
   * @private
   */
  private static isIgnorableSelector(selector: string): boolean {
    return selector === 'body' || selector === 'html' || selector === '#root'
  }

  /**
   * Get the elements from the selector.
   * @param selector
   * @private
   */
  private static getElementsFromSelector(selector: string): string[] {
    return selector.trim().split(' ')
  }

  private static getName(element: string): string {
    return element.split('[')[0].trim()
  }

  /**
   * Get the type of the element.
   * @param element
   * @private
   */
  private static getType(element: string): string {
    const match = element.match(ASTHandlerRuntime.ARGUMENT_REGEX)
    if (match && match[0]) {
      return match[0].split(']')[0].slice(1)
    } else {
      return 'div'
    }
  }

  /**
   * Get the attributes from the element.
   * @param element
   * @private
   */
  private static getAttributes(element: string): Map<string, string> {
    const attributes = new Map<string, string>()
    const match = element.match(ASTHandlerRuntime.ARGUMENT_REGEX)

    if (match && match[0]) {
      const split = match[0].split(']')
      split.shift()

      for (const value of split) {
        if (value) {
          const attribute = value.slice(1).split('=')
          attributes.set(attribute[0], attribute[1].slice(1, -1))
        }
      }
    }

    return attributes
  }
}
