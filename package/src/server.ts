import { JSDOM } from 'jsdom'
import ASTHandlerServer from './handler/ASTHandler'
import StyleHandlerServer from './handler/StyleHandler'
import { initialization } from './mod'
import ErrorHandlerServer from './server/ErrorHandlerServer'
import InputHandlerServer from './server/InputHandlerServer'
import { CurssedRenderOptions } from './types/Curssed.types'

export async function render(
  options: CurssedRenderOptions,
  initialDom = ''
): Promise<string> {
  const dom = new JSDOM(initialDom)

  const errorHandler = new ErrorHandlerServer()
  const inputHandler = new InputHandlerServer()
  const styleHandler = new StyleHandlerServer(dom.window.document)
  const astHandler = new ASTHandlerServer(dom.window.document)

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
