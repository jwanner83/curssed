import { initialization } from './mod'
import ASTHandlerRuntime from './runtime/ASTHandlerRuntime'
import ErrorHandlerRuntime from './runtime/ErrorHandlerRuntime'
import InputHandlerRuntime from './runtime/InputHandlerRuntime'
import StyleHandlerRuntime from './runtime/StyleHandlerRuntime'
import { CurssedRenderOptions } from './types/Curssed.types'

export async function render(
  element: HTMLElement,
  options: CurssedRenderOptions
) {
  const errorHandler = new ErrorHandlerRuntime()
  const inputHandler = new InputHandlerRuntime()
  const styleHandler = new StyleHandlerRuntime()
  const astHandler = new ASTHandlerRuntime()

  await initialization({
    astHandler,
    errorHandler,
    inputHandler,
    styleHandler,
    options,
    element
  })
}
