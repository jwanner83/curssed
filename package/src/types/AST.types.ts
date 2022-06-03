export interface CurssedAST {
  /**
   * The class or id of the node.
   */
  name: string

  /**
   * The type of the node.
   */
  type: string

  /**
   * The content of the node as a html string.
   */
  content: string

  /**
   * All the attributes of the node.
   */
  attributes: Map<string, string>

  /**
   * All child nodes.
   */
  children: CurssedAST[]
}
