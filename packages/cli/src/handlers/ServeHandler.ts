import { render } from '@curssed/compiler'
import { CurssedRenderOptions } from '@curssed/types'
import { App, Request } from '@tinyhttp/app'
import chalk from 'chalk'
import { watch } from 'chokidar'
import fse from 'fs-extra'
import { JSDOM } from 'jsdom'
import mime from 'mime-types'
import path from 'path'
import pretty from 'pretty'
import { tinyws, TinyWSRequest } from 'tinyws'
import ArgumentHandler from './ArgumentHandler'
import FileHandler from './FileHandler'
import LogHandler from './LogHandler'

const { lstat, pathExists, readFile } = fse

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
   * @private
   */
  private fileHandler: FileHandler

  /**
   * Socket connections mapping
   * @private
   */
  private sockets: Map<string, WebSocket[]> = new Map()

  constructor(log: LogHandler, args: ArgumentHandler) {
    this.log = log
    this.args = args
    this.fileHandler = new FileHandler()
  }

  /**
   * Serve the project
   */
  public async serve(): Promise<void> {
    const app = new App<any, Request & TinyWSRequest>()
    app.use(tinyws())

    app.use('*', async (req, res) => {
      const base = path.join(this.args.root, req.path)
      let file = base

      // if file exists without any modifications return it (e.g. assets)
      if ((await pathExists(base)) && (await lstat(base)).isFile()) {
        const content = await readFile(base)
        const type = await mime.lookup(base)
        return res.header('Content-Type', type).send(content)
      }

      let options: CurssedRenderOptions = {
        markup: {}
      }

      if (await pathExists(path.join(base, 'index.css'))) {
        file = path.join(base, 'index.css')
        options.markup.file = file
      } else if (await pathExists(base.replace('.html', '.css'))) {
        file = base.replace('.html', '.css')
        options.markup.file = file
      } else if (await pathExists(base + '.css')) {
        file = base + '.css'
        options.markup.file = file
      } else {
        console.log(chalk.red(`path '${req.path}' couldn't be handled`))
        return // return a rendered error message like in the runtime
      }

      if (this.args.css) {
        options.css = {
          file: this.args.css
        }
      }

      const jsdom = new JSDOM(await render(options))
      const document = jsdom.window.document
      const script = document.createElement('script')
      script.innerHTML = `
          const socket = new WebSocket('ws://localhost:${this.args.port}/${req.path}')
          socket.addEventListener('message', function (event) {
            document.body.innerHTML = event.data
          })
      `
      document.body.appendChild(script)

      if (req.ws) {
        const ws = await req.ws()

        const connections = this.sockets.get(file) || []
        connections.push(ws)
        this.sockets.set(file, connections)

        ws.on('close', () => {
          const connections = this.sockets.get(file) || []
          connections.splice(connections.indexOf(ws), 1)
          this.sockets.set(file, connections)
        })
      } else {
        res.send(pretty(jsdom.serialize()))
      }
    })

    app.listen(this.args.port)
    this.watch()
  }

  /**
   * Watching the root folder for changes inside css files
   * @private
   */
  private watch(): void {
    const watcher = watch(this.args.root + '/**/*.css', {
      persistent: true
    })

    watcher
      .on('change', (file) => this.live(file))
      .on('unlink', (file) => this.live(file))
  }

  /**
   * Notify all connections for a specific file
   * @param file
   * @private
   */
  private async live(file: string): Promise<void> {
    const connections = this.sockets.get(file) || []
    console.log(
      chalk.gray(
        `changes in '${file}'. realtime html manipulation on ${
          connections.length
        } connection${connections.length === 1 ? '' : 's'}`
      )
    )

    const options: CurssedRenderOptions = {
      markup: {
        file
      }
    }
    if (this.args.css) {
      options.css = {
        file: this.args.css
      }
    }
    const jsdom = new JSDOM(await render(options))
    const dom = pretty(jsdom.window.document.body.innerHTML)

    for (const connection of connections) {
      connection.send(dom)
    }
  }
}
