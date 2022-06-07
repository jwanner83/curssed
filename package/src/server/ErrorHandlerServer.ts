import ErrorHandler from '../interfaces/ErrorHandler'

export default class ErrorHandlerServer implements ErrorHandler {
  /**
   * The default error message title
   * @private
   */
  private static DEFAULT_TITLE = 'failed to render'

  public displayError(message, title = ErrorHandlerServer.DEFAULT_TITLE) {
    console.error(`${title}: ${message}`)
  }
}
