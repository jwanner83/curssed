import arg from 'arg'
import { copy } from 'fs-extra'
import { mkdir, writeFile } from 'fs/promises'
import pretty from 'pretty'
import { name, version } from '../package.json'
import LogHandler from './handlers/LogHandler'
import { render } from './server'
import { CurssedRenderOptions } from './types/Curssed.types'

void (async () => {
  const log = new LogHandler()

  console.log(`${name} - ${version}`)

  try {
    let options: CurssedRenderOptions = {
      markup: {}
    }

    const args = arg({
      '--markup': String,
      '--css': String
    })

    if (args['--markup']) {
      options.markup.file = args['--markup']
    } else {
      log.error(
        'failed to build page. required `--markup` argument not found or undefined.'
      )
    }

    if (args['--css']) {
      options = {
        ...options,
        css: {
          file: args['--css']
        }
      }
    }

    log.progress('rendering')
    const dom = await render(options)

    log.progress('writing output')
    await mkdir('dist', { recursive: true })
    await copy('public', 'dist')
    await writeFile('dist/index.html', pretty(dom), { flag: 'w+' })

    log.success('bundler done. the folder `dist` is ready for deployment.')
  } catch (exception) {
    const kebab: string = exception
      .toString()
      .replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1')
      .toLowerCase()
    log.error(`bundler failed. ${kebab}`)
  }

  log.close()
})()
