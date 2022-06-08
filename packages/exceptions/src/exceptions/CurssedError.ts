export default class CurssedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CurssedError'
  }
}
