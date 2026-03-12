import { useToast } from '@/composables/useToast'
import { ApiError, type ApiResponse } from '@/types/api'

const { show: showToast } = useToast()

interface BaseApiServiceOptions {
  path: string
  body?: unknown
  onError?: (message: string) => void
}

export abstract class BaseApiService {
  protected readonly httpUrl: string
  protected readonly TIMEOUT_MS = 5000

  constructor(serverUrl: string) {
    this.httpUrl = serverUrl.replace(/^ws(s?):\/\//, 'http$1://')
  }

  protected async get<T = void>(options: BaseApiServiceOptions): Promise<T> {
    const res = await fetch(`${this.httpUrl}${options.path}`, {
      signal: AbortSignal.timeout(this.TIMEOUT_MS),
    })
    return this.handleResponse<T>(res, options)
  }

  protected async post<T = void>(options: BaseApiServiceOptions): Promise<T> {
    const res = await fetch(`${this.httpUrl}${options.path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options.body),
      signal: AbortSignal.timeout(this.TIMEOUT_MS),
    })
    return this.handleResponse<T>(res, options)
  }

  private async handleResponse<T>(res: Response, options: BaseApiServiceOptions): Promise<T> {
    const body = (await res.json().catch(() => ({}))) as ApiResponse<T>

    if (!res.ok) {
      const message = body.error ?? 'Error inesperado del servidor'
      if (options?.onError) options.onError(message)
      else showToast(message)
      throw new ApiError(res.status, message)
    }

    return body.data as T
  }
}
