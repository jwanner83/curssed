import {
  ASTHandlerImplementation,
  initialization,
  StyleHandlerImplementation
} from '@curssed/core'
import { CurssedRenderOptions } from '@curssed/types'
import ErrorHandlerRuntime from './handlers/ErrorHandlerRuntime'
import InputHandlerRuntime from './handlers/InputHandlerRuntime'

export async function render(
  element: HTMLElement,
  options: CurssedRenderOptions
) {
  const errorHandler = new ErrorHandlerRuntime()
  const inputHandler = new InputHandlerRuntime()
  const styleHandler = new StyleHandlerImplementation(
    document,
    document.implementation.createHTMLDocument()
  )
  const astHandler = new ASTHandlerImplementation(document)

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
