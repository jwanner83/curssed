import ASTHandlerRuntime from './handlers/ASTHandler'
import StyleHandlerRuntime from './handlers/StyleHandler'
import { initialization } from './mod'
import ErrorHandlerRuntime from './handlers/runtime/ErrorHandlerRuntime'
import InputHandlerRuntime from './handlers/runtime/InputHandlerRuntime'
import { CurssedRenderOptions } from './types/Curssed.types'

export async function render(
  element: HTMLElement,
  options: CurssedRenderOptions
) {
  const errorHandler = new ErrorHandlerRuntime()
  const inputHandler = new InputHandlerRuntime()
  const styleHandler = new StyleHandlerRuntime(document, document.implementation.createHTMLDocument())
  const astHandler = new ASTHandlerRuntime(document)

  await initialization({
    astHandler,
    errorHandler,
    inputHandler,
    styleHandler,
    document,
    options,
    element
  })
}
