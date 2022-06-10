import { CurssedError } from '@curssed/exceptions'
import { ErrorHandler } from '@curssed/types'

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
