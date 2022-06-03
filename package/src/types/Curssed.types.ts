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
