import { render } from '../mod'

export default class ErrorHandler {

  /**
   * The default error message title
   * @private
   */
  private static DEFAULT_TITLE = 'failed to render'

  /**
   * Displays an error message.
   * @param title
   * @param message
   */
  public displayError(message, title = ErrorHandler.DEFAULT_TITLE) {
    render(
      document.body,
      {
        markup: {
          content:
            `
            .wrapper[div] {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;   
            }
            
            .wrapper .content {
                width: 600px;
                padding: 30px 30px 26px;
                border: 3px solid red;
                border-radius: 5px;
                background: #fff5f5;
                font-family: monospace;
            }
            
            .wrapper .content .title[h1] {
                color: red;
                margin-top: 8px;
                content: "${ErrorHandler.getValidContent(title)}";
            }
            
            .wrapper .content .message[p] {
                color: #ff6565;
                margin-bottom: 0;
                line-height: 24px;
                content: "${ErrorHandler.getValidContent(message)}";
            }
            `
        }
      }
    ).then()
  }

  /**
   * Get a valid content
   * @param message
   * @private
   */
  private static getValidContent(message: string): string {
    return message.replaceAll('"', '\\"')
  }
}
