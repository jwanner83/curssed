import arg from 'arg'
import path from 'path'
import { CommandTypes } from '../types/Command.types'

export default class ArgumentHandler {
  /**
   * The argument types
   */
  public args

  /**
   * The command type
   */
  public command: CommandTypes

  /**
   * The root folder
   */
  public root: string = path.join('public')

  /**
   * Returns the additional css file
   */
  public css: string

  /**
   * Returns the port
   */
  public port: number = 3000

  constructor() {
    this.args = arg({
      '--root': String,
      '--css': String,
      '--port': Number
    })

    if (this.args['_'].includes('build')) {
      this.command = CommandTypes.Build
    } else if (this.args['_'].includes('serve')) {
      this.command = CommandTypes.Serve
    } else {
      throw new Error(
        'failed. specify, what the cli should do. (e.g. `curssed build`)'
      )
    }

    if (this.args['--root']) {
      this.root = path.join(this.args['--root'])
    }

    if (this.args['--css']) {
      this.css = this.args['--css']
    }

    if (this.args['--port']) {
      this.port = this.args['--port']
    }
  }
}
