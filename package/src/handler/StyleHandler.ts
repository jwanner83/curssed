import ASTHandler from './ASTHandler'

export default class StyleHandler {
  /**
   * Document to create style nodes.
   * @private
   */
  private document: Document

  constructor(document: Document) {
    this.document = document
  }

  /**
   * Reads the input options and returns the content.
   * @param css
   */
  public getRules(css: string): CSSRuleList {
    const style = this.document.createElement('style')
    style.textContent = css
    this.document.body.appendChild(style)

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
    this.document.head.appendChild(temp)

    for (const rule of Array.from(temp.sheet.cssRules) as CSSStyleRule[]) {
      edited = edited.replace(
        rule.selectorText,
        StyleHandler.getCleanedSelector(rule.selectorText)
      )
    }

    const style = this.document.createElement('style')
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
