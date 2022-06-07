import { CurssedInitializationOptions } from './types/Curssed.types'

export async function initialization({
  astHandler,
  errorHandler,
  inputHandler,
  styleHandler,
  document,
  options,
  element
}: CurssedInitializationOptions) {
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
