import { CurssedAST } from '../types/AST.types'

export default class AST implements CurssedAST {
  name: string
  type: string
  content: string
  attributes: Map<string, string>
  children: AST[]

  constructor(
    name: string,
    type: string = 'div',
    content: string = '',
    attributes: Map<string, string> = new Map()
  ) {
    this.name = name
    this.type = type
    this.content = content
    this.attributes = attributes
    this.children = []
  }

  /**
   * Create empty AST node.
   */
  public static createEmpty() {
    return new AST('')
  }

  /**
   * Set the content of the node.
   * @param rule
   */
  public setContent(rule: CSSStyleRule) {
    this.content = rule.style.content.slice(1, -1)
  }
}
