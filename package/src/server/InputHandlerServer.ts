import { readFile } from 'fs'
import { promisify } from 'util'
import CurssedError from '../exceptions/CurssedError'
import InputHandler from '../interfaces/InputHandler'
import { CurssedInputOptions } from '../types/Curssed.types'

export default class InputHandlerServer implements InputHandler {
  async resolveContent(input: CurssedInputOptions): Promise<string> {
    if (input.content && input.file) {
      throw new CurssedError(
        'you can only provide either a content or a file input and not both at the same time.'
      )
    }

    if (input.file) {
      return InputHandlerServer.readFile(input.file)
    } else {
      return input.content
    }
  }

  /**
   * Reads the file with fs.readFile and returns the content.
   * @param file
   * @private
   */
  private static async readFile(file: string): Promise<string> {
    try {
      const buffer = await promisify(readFile)(file)
      return buffer.toString()
    } catch (error) {
      throw new CurssedError(
        `could not read file '${file}'. make sure that the file exists.`
      )
    }
  }
}
