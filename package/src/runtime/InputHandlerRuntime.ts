import CurssedError from '../exceptions/CurssedError'
import InputHandler from '../interfaces/InputHandler'
import { CurssedInputOptions } from '../types/Curssed.types'

export default class InputHandlerRuntime implements InputHandler {
  async resolveContent(input: CurssedInputOptions): Promise<string> {
    if (input.content && input.file) {
      throw new CurssedError(
        'you can only provide either a content or a file input and not both at the same time.'
      )
    }

    if (input.file) {
      return this.readFile(input.file)
    } else {
      return input.content
    }
  }

  async readFile(file: string): Promise<string> {
    const response = await fetch(file)

    if (!response.ok) {
      throw new CurssedError(
        `could not read file '${file}'. make sure that you've written the correct name and it is available publicly.`
      )
    }

    return await response.text()
  }
}
