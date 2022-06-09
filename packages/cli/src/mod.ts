import { name, version } from '../package.json'
import LogHandler from './handlers/LogHandler'
import ArgumentHandler from './handlers/ArgumentHandler'
import { CommandTypes } from './types/Command.types'
import BuildHandler from './handlers/BuildHandler'
import ServeHandler from './handlers/ServeHandler'

void (async () => {
  const log = new LogHandler()

  console.log(`${name} - ${version}`)

  try {
    const args = new ArgumentHandler()

    if (args.command === CommandTypes.Build) {
      const buildHandler = new BuildHandler(log, args)
      await buildHandler.build()
    } else if (args.command === CommandTypes.Serve) {
      log.success(`started server on http://localhost:${args.port}/`)
      const serveHandler = new ServeHandler(log, args)
      await serveHandler.serve()
    } else {
      log.error('failed. specify, what the cli should do. (e.g. `curssed build` or `curssed serve`)')
      log.close()
      return
    }
  } catch (exception) {
    const kebab: string = exception
      .toString()
      .replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1')
      .toLowerCase()
    log.error(`failed. ${kebab}`)
  }

  log.close()
})()

