import { ErrorHandler } from '@curssed/types'
import { CurssedError } from '@curssed/exceptions'

export default class ErrorHandlerServer implements ErrorHandler {
  /**
   * The default error message title
   * @private
   */
  private static DEFAULT_TITLE = 'failed to render'

  public handleError(message, title = ErrorHandlerServer.DEFAULT_TITLE) {
    throw new CurssedError(message)
  }
}
