export interface ApiResponse<T = void> {
  success: boolean
  message?: string
  data?: T
  error?: string
}
export declare const ApiResponse: {
  success<T>(data?: T, message?: string): ApiResponse<T>
  error<T = void>(message: string): ApiResponse<T>
}
