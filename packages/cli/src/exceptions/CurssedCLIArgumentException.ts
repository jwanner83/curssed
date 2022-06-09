export default class CurssedCLIArgumentException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CurssedCLIArgumentException'
  }
}
