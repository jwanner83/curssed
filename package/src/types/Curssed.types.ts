import ASTHandler from '../handler/ASTHandler'
import StyleHandler from '../handler/StyleHandler'
import ErrorHandler from '../interfaces/ErrorHandler'
import InputHandler from '../interfaces/InputHandler'

export interface CurssedRenderOptions {
  /**
   * The markup input options which will get rendered.
   */
  markup: CurssedInputOptions

  /**
   * Additional css which will not be processd by curssed and instead
   * will be added to the rendered output as is.
   */
  css?: CurssedInputOptions
}

export interface CurssedInputOptions {
  /**
   * The input as a string.
   */
  content?: string

  /**
   * The input as a file path which will be read and parsed.
   */
  file?: string
}

export interface CurssedInitializationOptions {
  /**
   * The ast handler
   */
  astHandler: ASTHandler

  /**
   * The error handler either runtime or server
   */
  errorHandler: ErrorHandler

  /**
   * The input handler either runtime or server
   */
  inputHandler: InputHandler

  /**
   * The style handler
   */
  styleHandler: StyleHandler

  /**
   * The document instance
   */
  document: Document

  /**
   * The curssed render options
   */
  options: CurssedRenderOptions

  /**
   * The curssed root element
   */
  element: HTMLElement
}
