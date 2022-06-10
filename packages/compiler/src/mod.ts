import {
  ASTHandlerImplementation,
  initialization,
  StyleHandlerImplementation
} from '@curssed/core'
import { CurssedRenderOptions } from '@curssed/types'
import { JSDOM } from 'jsdom'
import ErrorHandlerServer from './handlers/ErrorHandlerServer'
import InputHandlerServer from './handlers/InputHandlerServer'

export async function render(options: CurssedRenderOptions): Promise<string> {
  const dom = new JSDOM()

  const errorHandler = new ErrorHandlerServer()
  const inputHandler = new InputHandlerServer()
  const styleHandler = new StyleHandlerImplementation(
    dom.window.document,
    new JSDOM().window.document
  )
  const astHandler = new ASTHandlerImplementation(dom.window.document)

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
