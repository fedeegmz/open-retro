export default class AlreadyExistError extends Error {
  constructor(message: string = 'Resource already exists') {
    super(message)
  }
}
