import { JSDOM } from 'jsdom'
import ASTHandlerServer from './handlers/ASTHandler'
import StyleHandlerServer from './handlers/StyleHandler'
import { initialization } from './mod'
import ErrorHandlerServer from './handlers/server/ErrorHandlerServer'
import InputHandlerServer from './handlers/server/InputHandlerServer'
import { CurssedRenderOptions } from './types/Curssed.types'

export async function render(
  options: CurssedRenderOptions,
): Promise<string> {
  const dom = new JSDOM()

  const errorHandler = new ErrorHandlerServer()
  const inputHandler = new InputHandlerServer()
  const styleHandler = new StyleHandlerServer(dom.window.document, (new JSDOM()).window.document)
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
