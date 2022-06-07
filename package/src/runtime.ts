import { CurssedRenderOptions } from './types/Curssed.types'
import InputHandlerRuntime from './runtime/InputHandlerRuntime'
import StyleHandlerRuntime from './runtime/StyleHandlerRuntime'
import ASTHandlerRuntime from './runtime/ASTHandlerRuntime'
import ErrorHandlerRuntime from './runtime/ErrorHandlerRuntime'

export async function render (element: HTMLElement, options: CurssedRenderOptions) {
  const errorHandler = new ErrorHandlerRuntime()
  const inputHandler = new InputHandlerRuntime()
  const styleHandler = new StyleHandlerRuntime()
  const astHandler = new ASTHandlerRuntime()

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
