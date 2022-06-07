import ASTHandlerRuntime from './handler/ASTHandler'
import StyleHandlerRuntime from './handler/StyleHandler'
import { initialization } from './mod'
import ErrorHandlerRuntime from './runtime/ErrorHandlerRuntime'
import InputHandlerRuntime from './runtime/InputHandlerRuntime'
import { CurssedRenderOptions } from './types/Curssed.types'

export async function render(
  element: HTMLElement,
  options: CurssedRenderOptions
) {
  const errorHandler = new ErrorHandlerRuntime()
  const inputHandler = new InputHandlerRuntime()
  const styleHandler = new StyleHandlerRuntime(document)
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
