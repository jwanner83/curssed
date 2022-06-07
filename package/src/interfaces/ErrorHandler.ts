export default interface ErrorHandler {
  /**
   * Displays an error message.
   * @param title
   * @param message
   */
  displayError(message, title?): void
}
