import { render } from '../package/dist/curssed.js'

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
