import arg from 'arg'
import { copy } from 'fs-extra'
import { mkdir, writeFile, readdir } from 'fs/promises'
import pretty from 'pretty'
import { name, version } from '../package.json'
import LogHandler from './handlers/LogHandler'
import { render } from '@curssed/compiler'
import path, { sep } from 'path'
import { CurssedRenderOptions } from '@curssed/types'

void (async () => {
  const log = new LogHandler()

  console.log(`${name} - ${version}`)

  try {
    let root = path.join('pages')
    let pages: Map<string, string> = new Map()
    let options: CurssedRenderOptions = {
      markup: {}
    }

    const args = arg({
      '--root': String,
      '--css': String
    })

    if (!args['_'].includes('build')) {
      log.error('failed. specify, what the cli should do. (e.g. `curssed build`)')
      log.close()
      return
    }

    if (args['--root']) {
      root = path.join(args['--root'])
    }

    if (args['--css']) {
      options.css = {
        file: args['--css']
      }
    }

    log.progress('resolving pages')
    const files = await getMarkupFiles(root)

    for (const [index, file] of files.entries()) {
      log.progress(`rendering ${index + 1} of ${files.length} pages`)
      pages.set(file, await render({
        ...options,
        markup: {
          file
        }
      }))
    }

    for (const [key, document] of pages) {
      log.progress(`writing pages`)
      const dir = key.replace(root, 'dist').replace('.css', '.html')

      const folder  = dir.split(sep)
      folder.pop()
      await mkdir(folder.join(sep), { recursive: true })
      await writeFile(dir, pretty(document), { flag: 'w+' })
    }

    await copy('public', 'dist')

    log.success('done. the folder `dist` is ready for deployment.')
  } catch (exception) {
    const kebab: string = exception
      .toString()
      .replace(/((?<=[a-z\d])[A-Z]|(?<=[A-Z\d])[A-Z](?=[a-z]))/g, '-$1')
      .toLowerCase()
    log.error(`failed. ${kebab}`)
  }

  log.close()
})()

/**
 * Get all .css files recursively from directory
 * @param dir
 */
async function getMarkupFiles (dir: string) {
  const paths: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.css')) {
      paths.push(`${dir}${sep}${entry.name}`)
    } else if (entry.isDirectory()) {
      const children = await getMarkupFiles(`${dir}${sep}${entry.name}`)
      paths.push(...children)
    }
  }

  return paths
}
