import LogHandler from './LogHandler'
import ArgumentHandler from './ArgumentHandler'
import FileHandler from './FileHandler'
import { App, Request } from '@tinyhttp/app'
import { tinyws, TinyWSRequest } from 'tinyws'
import path from 'path'
import { render } from '@curssed/compiler'
import { CurssedRenderOptions } from '@curssed/types'
import pretty from 'pretty'
import mime from 'mime-types'
import { readFile, pathExists, lstat } from 'fs-extra'
import { JSDOM } from 'jsdom'
import { watch } from 'chokidar'
import chalk from 'chalk'

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
  public async serve (): Promise<void> {
    const app = new App<any, Request & TinyWSRequest>()
    app.use(tinyws())

    app.use('*', async (req, res) => {
      const base = path.join(this.args.root, req.path)
      let file = base

      // if file exists without any modifications return it (e.g. assets)
      if (await pathExists(base) && (await lstat(base)).isFile()) {
        const content = await readFile(base)
        const type = await mime.lookup(base)
        return res.header('Content-Type', type).send(content)
      }

      let options: CurssedRenderOptions = {
        markup: {}
      }

      if (await pathExists(path.join(base,'index.css'))) {
        file = path.join(base,'index.css')
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
            if (event.data === 'reload') { location.reload() }
          });
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
  private watch (): void {
    const watcher = watch(this.args.root + '/**/*.css', {
      persistent: true
    });

    watcher
    .on('change', file => this.notify(file))
    .on('unlink', file => this.notify(file));
  }

  /**
   * Notify all connections for a specific file
   * @param file
   * @private
   */
  private notify (file: string): void {
    const connections = this.sockets.get(file) || []

    console.log(chalk.gray(`changes in '${file}'. hot reloading ${connections.length} connection${connections.length === 1 ? '' : 's'}`))

    for (const connection of connections) {
      connection.send('reload')
    }
  }
}
