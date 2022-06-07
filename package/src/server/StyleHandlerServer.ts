import StyleHandler from '../interfaces/StyleHandler'
import ASTHandlerServer from './ASTHandlerServer'
import { JSDOM } from 'jsdom'

export default class StyleHandlerServer implements StyleHandler {
  /**
   * Virtual document to create style nodes.
   * @private
   */
  private virtual: Document

  constructor() {
    this.virtual = (new JSDOM('')).window.document
  }

  /**
   * Reads the input options and returns the content.
   * @param css
   */
  public getRules(css: string): CSSRuleList {
    const style = this.virtual.createElement('style')
    style.textContent = css
    this.virtual.body.appendChild(style)

    return style.sheet.cssRules
  }

  /**
   * Get a style node from the given string.
   * @param css
   */
  public renderCSS(css: string) {
    let edited = '' + css

    const temp = this.virtual.createElement('style')
    temp.innerHTML = css
    this.virtual.head.appendChild(temp)

    for (const rule of Array.from(temp.sheet.cssRules) as CSSStyleRule[]) {
      edited = edited.replace(
        rule.selectorText,
        StyleHandlerServer.getCleanedSelector(rule.selectorText)
      )
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
    return selector.trim().replaceAll(ASTHandlerServer.ARGUMENT_REGEX, '')
  }
}
