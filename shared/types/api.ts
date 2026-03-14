export interface ApiResponse<T = void> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export const ApiResponse = {
  success<T>(data?: T, message?: string): ApiResponse<T> {
    return { success: true, message, data }
  },
  error<T = void>(message: string): ApiResponse<T> {
    return { success: false, error: message }
  },
}
