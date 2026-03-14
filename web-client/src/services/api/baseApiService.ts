import { useToast } from '@/composables/useToast'
import { ApiResponse } from '@shared/types/api'
const { show: showToast } = useToast()

interface BaseApiServiceOptions<T = void> {
  path: string
  body?: unknown
  hideToast?: boolean
  onSuccess?: (data: ApiResponse<T>) => void
  onError?: (message: string) => void
}

export abstract class BaseApiService {
  protected readonly httpUrl: string
  protected readonly TIMEOUT_MS = 5000

  constructor(serverUrl: string) {
    this.httpUrl = serverUrl.replace(/^ws(s?):\/\//, 'http$1://')
  }

  protected async get<T = void>(
    options: Omit<BaseApiServiceOptions<T>, 'body'>,
  ): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.httpUrl}${options.path}`, {
      signal: AbortSignal.timeout(this.TIMEOUT_MS),
    })
    return this.handleResponse<T>(res, options as BaseApiServiceOptions<T>)
  }

  protected async post<T = void>(options: BaseApiServiceOptions<T>): Promise<ApiResponse<T>> {
    const res = await fetch(`${this.httpUrl}${options.path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options.body),
      signal: AbortSignal.timeout(this.TIMEOUT_MS),
    })
    return this.handleResponse<T>(res, options)
  }

  private async handleResponse<T = void>(
    res: Response,
    options: BaseApiServiceOptions<T>,
  ): Promise<ApiResponse<T>> {
    const body = (await res.json().catch(() => ({}))) as ApiResponse<T>

    if (!res.ok || body.success === false) {
      const message = body.error ?? 'Unknown error'

      if (!options.hideToast) {
        showToast(message)
      }

      options.onError?.(message)
    } else {
      options.onSuccess?.(body)
    }

    return body
  }
}
