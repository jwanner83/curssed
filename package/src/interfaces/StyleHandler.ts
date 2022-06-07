export default interface StyleHandler {
  /**
   * Reads the input options and returns the content.
   * @param css
   */
  getRules(css: string): CSSRuleList

  /**
   * Get a style node from the given string.
   * @param css
   */
  renderCSS(css: string): HTMLStyleElement
}
