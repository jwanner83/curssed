import ASTHandlerServer from './server/ASTHandlerServer'
import ErrorHandlerServer from './server/ErrorHandlerServer'
import InputHandlerServer from './server/InputHandlerServer'
import StyleHandlerServer from './server/StyleHandlerServer'
import { CurssedRenderOptions } from './types/Curssed.types'
import { initialization } from './mod'
import { JSDOM } from 'jsdom'

export async function render(
  element: HTMLElement,
  options: CurssedRenderOptions
) {
  const errorHandler = new ErrorHandlerServer()
  const inputHandler = new InputHandlerServer()
  const styleHandler = new StyleHandlerServer()
  const astHandler = new ASTHandlerServer()

  const { document } = (new JSDOM()).window

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
