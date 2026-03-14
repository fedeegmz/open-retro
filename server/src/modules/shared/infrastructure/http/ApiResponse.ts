export class ApiResponse<T = void> {
  success: boolean
  message?: string
  data?: T
  error?: string

  private constructor(success: boolean, message?: string, data?: T, error?: string) {
    this.success = success
    this.message = message
    this.data = data
    this.error = error
  }

  static success<T>(data?: T, message?: string): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data, undefined)
  }

  static error<T = void>(message: string): ApiResponse<T> {
    return new ApiResponse<T>(false, undefined, undefined, message)
  }
}
