import { CurssedInputOptions } from '../types/Curssed.types'

export default interface InputHandler {
  /**
   * Reads the input options and returns the content.
   * @param input
   */
  resolveContent(input: CurssedInputOptions): Promise<string>
}
