import LogHandler from './LogHandler'
import ArgumentHandler from './ArgumentHandler'
import FileHandler from './FileHandler'
import { CurssedRenderOptions } from '@curssed/types'
import pretty from 'pretty'
import { render } from '@curssed/compiler'
import { sep } from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { copy } from 'fs-extra'

export default class BuildHandler {
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
   * Build the project
   */
  public async build (): Promise<void> {
    let pages: Map<string, string> = new Map()
    let options: CurssedRenderOptions = {
      markup: {}
    }

    if (this.args.css) {
      options.css = {
        file: this.args.css
      }
    }

    this.log.progress('resolving pages')
    const files = await this.fileHandler.getFiles(this.args.root)
    const markup = files.filter(item => item.endsWith('.css'))
    const assets = files.filter(item => !item.endsWith('.css'))

    for (const [index, file] of markup.entries()) {
      this.log.progress(`rendering ${index + 1} of ${markup.length} pages`)
      pages.set(file, await render({
        ...options,
        markup: {
          file
        }
      }))
    }

    for (const [key, document] of pages) {
      this.log.progress(`writing pages`)
      const dir = key.replace(this.args.root, 'dist').replace('.css', '.html')

      const folder  = dir.split(sep)
      folder.pop()
      await mkdir(folder.join(sep), { recursive: true })
      await writeFile(dir, pretty(document), { flag: 'w+' })
    }

    for (const asset of assets) {
      const dest = asset.replace(this.args.root, 'dist')
      await copy(asset, dest)
    }

    this.log.success('done. the folder `dist` is ready for deployment.')
  }
}
