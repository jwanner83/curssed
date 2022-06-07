import ASTHandlerServer from './server/ASTHandlerServer'
import ErrorHandlerServer from './server/ErrorHandlerServer'
import InputHandlerServer from './server/InputHandlerServer'
import StyleHandlerServer from './server/StyleHandlerServer'
import { CurssedRenderOptions } from './types/Curssed.types'
import { initialization } from './mod'
import { JSDOM } from 'jsdom'

export async function render(
  options: CurssedRenderOptions,
  initialDom = '',
): Promise<string> {
  const errorHandler = new ErrorHandlerServer()
  const inputHandler = new InputHandlerServer()
  const styleHandler = new StyleHandlerServer()
  const astHandler = new ASTHandlerServer()

  const dom = (new JSDOM(initialDom))

  await initialization({
    astHandler,
    errorHandler,
    inputHandler,
    styleHandler,
    document: dom.window.document,
    options,
    element: dom.window.document.body
  })

  return dom.serialize()
}
