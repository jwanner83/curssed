import { name, version } from '../package.json'
import arg from 'arg'
import { render } from './server'
import { CurssedRenderOptions } from './types/Curssed.types'
import { writeFile, mkdir, readFile } from 'fs/promises'
import Logger from './log/Logger'
import pretty from 'pretty'

void (async () => {
  const log = new Logger()

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
      log.error('failed to build page. required `--markup` argument not found or undefined.')
    }

    if (args['--css']) {
      options = {
        ...options,
        css: {
          file: args['--css']
        }
      }
    }

    let html = ''
    try {
      html = (await readFile('public/index.html')).toString()
    } catch (error) {
      log.error('failed to read index.html from public/index.html.')
    }

    log.progress('rendering')
    const dom = await render(options, html)

    log.progress('writing to file')
    await mkdir('dist', { recursive: true })
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
