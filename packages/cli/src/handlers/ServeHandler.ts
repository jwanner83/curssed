import LogHandler from './LogHandler'
import ArgumentHandler from './ArgumentHandler'
import FileHandler from './FileHandler'
import { App, Request } from '@tinyhttp/app'
import { tinyws, TinyWSRequest } from 'tinyws'
import path from 'path'
import { render } from '@curssed/compiler'
import { CurssedRenderOptions } from '@curssed/types'
import pretty from 'pretty'

export default class ServeHandler {
  /**
   * The log handler
   * @private
   */
  private log: LogHandler

  /**
   * The argument handler
   * @private
   */
  private args: ArgumentHandler

  /**
   * The file handler
   */
  public fileHandler: FileHandler

  constructor(log: LogHandler, args: ArgumentHandler) {
    this.log = log
    this.args = args
    this.fileHandler = new FileHandler()
  }

  /**
   * Serve the project
   */
  public async serve (): Promise<void> {
    const app = new App<any, Request & TinyWSRequest>()
    app.use(tinyws())

    app.use('*', async (req, res) => {
      const file = path.join(this.args.root, req.path)

      let options: CurssedRenderOptions = {
        markup: {
          file: file.replace('.html', '') + '.css'
        }
      }

      if (this.args.css) {
        options.css = {
          file: this.args.css
        }
      }

      const dom = await render(options)

      if (req.ws) {
        const ws = await req.ws()

        return ws.send('hello there')
      } else {
        res.send(pretty(dom))
      }
    })

    app.listen(this.args.port)
  }
}
