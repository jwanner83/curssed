import { StyleHandler } from '@curssed/types'
import ASTHandlerImplementation from './ASTHandlerImplementation'

export default class StyleHandlerImplementation implements StyleHandler {
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

  public getRules(css: string): CSSRuleList {
    const style = this.virtual.createElement('style')
    style.textContent = css
    this.virtual.head.appendChild(style)

    return style.sheet.cssRules
  }

  public renderCSS(css: string) {
    const raw = this.document.createElement('style')
    raw.innerHTML = css
    this.virtual.head.appendChild(raw)

    const work = this.virtual.createElement('style')
    work.innerHTML = ''
    this.virtual.head.appendChild(work)

    for (const rule of Array.from(raw.sheet.cssRules) as CSSStyleRule[]) {
      if (!rule.selectorText.startsWith('::before')) {
        work.sheet.insertRule(
          rule.cssText.replace(
            rule.selectorText,
            StyleHandlerImplementation.getCleanedSelector(rule.selectorText)
          )
        )
      }
    }

    const rules = (Array.from(work.sheet.cssRules) as CSSStyleRule[]).map(
      (rule) => rule.cssText
    )
    const clean = this.virtual.createElement('style')
    clean.innerHTML = rules.join(' ')

    return clean
  }

  /**
   * Get a clean selector from the given string.
   * @param selector
   * @private
   */
  private static getCleanedSelector(selector: string) {
    return selector
      .trim()
      .replaceAll(ASTHandlerImplementation.ARGUMENT_REGEX, '')
  }
}
