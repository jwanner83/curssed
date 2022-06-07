import { name, version } from '../package.json'
import arg from 'arg'
import { render } from './server'
import { CurssedRenderOptions } from './types/Curssed.types'

void (async () => {
  console.log(`${name} - ${version}`)

  let options: CurssedRenderOptions = {
    markup: {
      file: ''
    }
  }

  const args = arg({
    '--markup': String,
    '--style': String
  })

  if (args['--markup']) {
    options.markup.file = args['--markup']
  } else {
    console.error('failed')
  }

  if (args['--style']) {
    options.markup.file = args['--markup']
  }

  const document = render(options)
})()
