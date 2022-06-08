import { ASTHandler, CurssedAST } from '@curssed/types'
import { CurssedError } from '@curssed/exceptions'
import AST from '../models/AST'

export default class ASTHandlerImplementation implements ASTHandler {
  /**
   * Document to create style nodes.
   * @private
   */
  private document: Document

  constructor(document: Document) {
    this.document = document
  }

  /**
   * Regex to get the arguments
   */
  public static ARGUMENT_REGEX = /\[.*]/g

  /**
   * Reads the input options and returns the content.
   * @param rules
   */
  public resolveAST(rules: CSSRuleList): { body: CurssedAST, head: CurssedAST } {
    const body = new AST('#root', 'main')
    const head = new AST('#head', 'head')

    for (const rule of Array.from(rules) as CSSStyleRule[]) {
      const selectorText = rule.selectorText
        .replace(/(\r\n|\n|\r)/gm, '')
        .replaceAll('  ', ' ')

      if (ASTHandlerImplementation.isIgnorableSelector(rule.selectorText)) {
        continue
      }

      let current = body
      const child = AST.createEmpty()

      if (rule.style.content) {
        child.setContent(rule)
      }

      if (ASTHandlerImplementation.isHeadSelector(selectorText)) {
        child.type = ASTHandlerImplementation.getType(selectorText)
        child.attributes = ASTHandlerImplementation.getAttributes(selectorText)

        head.children.push(child)
        continue
      }

      const elements = ASTHandlerImplementation.getElementsFromSelector(selectorText)

      elements.forEach((element, index) => {
        if (ASTHandlerImplementation.isHeadSelector(selectorText)) {
          throw new CurssedError(`the head declaration '::before' can only appear at top level and cannot be nested.`)
        }

        const name = ASTHandlerImplementation.getName(element)

        if (index === elements.length - 1) {
          child.attributes = ASTHandlerImplementation.getAttributes(element)
          child.type = ASTHandlerImplementation.getType(element)
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

      child.name = ASTHandlerImplementation.getName(elements[elements.length - 1])
      current.children.push(child)
    }

    return { body, head }
  }

  /**
   * Convert the whole AST to an HTML nodes.
   * @param ast
   */
  public convertASTToNode(ast: AST): HTMLElement {
    return this.getNodeFromAST(ast)
  }

  /**
   * Get an HTML node from an AST object.
   * @param ast
   * @private
   */
  private getNodeFromAST(ast: AST): HTMLElement {
    const node = this.document.createElement(ast.type)

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
        node.appendChild(this.getNodeFromAST(child))
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
   * Checks if the selector is a head selector.
   * @param selector
   * @private
   */
  private static isHeadSelector(selector: string): boolean {
    return selector.startsWith('::before')
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
    const match = element.match(ASTHandlerImplementation.ARGUMENT_REGEX)
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
    const match = element.match(ASTHandlerImplementation.ARGUMENT_REGEX)

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
