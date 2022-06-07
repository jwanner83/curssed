export default interface ErrorHandler {
  /**
   * Displays an error message.
   * @param title
   * @param message
   */
  handleError(message, title?): void
}
