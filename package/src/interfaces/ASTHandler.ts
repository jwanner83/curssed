import AST from '../models/AST'

export default interface ASTHandler {
  /**
   * Reads the input options and returns the content.
   * @param rules
   */
  resolveAST(rules: CSSRuleList): AST

  /**
   * Convert the whole AST to an HTML nodes.
   * @param ast
   */
  convertASTToNode(ast: AST): HTMLElement
}
