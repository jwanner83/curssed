import ASTHandler from './ASTHandler'

export default class StyleHandler {
  /**
   * The actual document.
   * @private
   */
  private document: Document

  /**
   * A virtual document to create style nodes.
   * @private
   */
  private virtual: Document

  constructor(document: Document, virtual: Document) {
    this.document = document
    this.virtual = virtual
  }

  /**
   * Reads the input options and returns the content.
   * @param css
   */
  public getRules(css: string): CSSRuleList {
    const style = this.virtual.createElement('style')
    style.textContent = css
    this.virtual.head.appendChild(style)

    return style.sheet.cssRules
  }

  /**
   * Get a style node from the given string.
   * @param css
   */
  public renderCSS(css: string) {
    let edited = '' + css

    const temp = this.document.createElement('style')
    temp.innerHTML = css
    this.virtual.head.appendChild(temp)

    for (const rule of Array.from(temp.sheet.cssRules) as CSSStyleRule[]) {
      if (!rule.selectorText.startsWith('::before')) {
        edited = edited.replace(
          rule.selectorText,
          StyleHandler.getCleanedSelector(rule.selectorText)
        )
      }
    }

    const style = this.virtual.createElement('style')
    style.innerHTML = edited

    return style
  }

  /**
   * Get a clean selector from the given string.
   * @param selector
   * @private
   */
  private static getCleanedSelector(selector: string) {
    return selector.trim().replaceAll(ASTHandler.ARGUMENT_REGEX, '')
  }
}
