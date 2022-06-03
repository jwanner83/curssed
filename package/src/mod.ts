import { CurssedRenderOptions } from './types/Curssed.types'
import InputHandler from './handlers/InputHandler'

export async function render (element: HTMLElement, options: CurssedRenderOptions) {
  const inputHandler = new InputHandler()

  try {
    const markup = await inputHandler.resolveContent(options.markup)
  } catch (error) {
    console.error(error)
  }
}
