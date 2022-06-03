import { render } from '../package/dist/mod.js'

render(
  document.body,
  {
    markup: {
      file: 'content.css'
    },
    css: {
      file: 'reset.css'
    }
  }
).then()
