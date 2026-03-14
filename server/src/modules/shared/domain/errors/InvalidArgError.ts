export default class InvalidArgError extends Error {
  constructor(message: string = 'Invalid arguments') {
    super(message)
  }
}
