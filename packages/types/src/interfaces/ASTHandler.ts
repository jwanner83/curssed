import { CurssedAST } from '../types/AST.types'

export default interface ASTHandler {
  /**
   * Reads the input options and returns the content.
   * @param rules
   */
  resolveAST(rules: CSSRuleList): { body: CurssedAST, head: CurssedAST }

  /**
   * Convert the whole AST to an HTML nodes.
   * @param ast
   */
  convertASTToNode(ast: CurssedAST): HTMLElement
}
