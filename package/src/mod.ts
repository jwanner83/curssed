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
    const { body, head } = astHandler.resolveAST(curssed)

    const bodyNode = astHandler.convertASTToNode(body)
    const headNode = astHandler.convertASTToNode(head)

    document.head.appendChild(styleHandler.renderCSS(markup))
    if (options.css) {
      const css = await inputHandler.resolveContent(options.css)
      document.head.appendChild(styleHandler.renderCSS(css))
    }

    headNode.childNodes.forEach(child => document.head.appendChild(child))
    element.appendChild(bodyNode)
  } catch (error) {
    errorHandler.handleError(error.message)
  }
}
