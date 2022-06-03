import { CurssedRenderOptions } from './types/Curssed.types'
import InputHandler from './handlers/InputHandler'
import StyleHandler from './handlers/StyleHandler'
import ASTHandler from './handlers/ASTHandler'
import ErrorHandler from './handlers/ErrorHandler'

export async function render (element: HTMLElement, options: CurssedRenderOptions) {
  const errorHandler = new ErrorHandler()
  const inputHandler = new InputHandler()
  const styleHandler = new StyleHandler()
  const astHandler = new ASTHandler()

  try {
    const markup = await inputHandler.resolveContent(options.markup)
    const curssed = styleHandler.getRules(markup)
    const ast = astHandler.resolveAST(curssed)
    const node = astHandler.convertASTToNode(ast)

    document.head.appendChild(styleHandler.renderCSS(markup))
    if (options.css) {
      const css = await inputHandler.resolveContent(options.css)
      document.head.appendChild(styleHandler.renderCSS(css))
    }

    element.appendChild(node)
  } catch (error) {
    errorHandler.displayError(error.message)
  }
}
