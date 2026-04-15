import { useToast } from '@/composables/useToast'
import { ApiResponse } from '@open-retro/shared/types/api'
import { joinPath } from '@/utils/stringUtils'
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
    try {
      const locale = localStorage.getItem('lang') || 'en'
      const res = await fetch(joinPath([this.httpUrl, options.path]), {
        headers: { 'Accept-Language': locale },
        signal: AbortSignal.timeout(this.TIMEOUT_MS),
      })
      return this.handleResponse<T>(res, options as BaseApiServiceOptions<T>)
    } catch {
      return this.handleNetworkError(options as BaseApiServiceOptions<T>)
    }
  }

  protected async post<T = void>(options: BaseApiServiceOptions<T>): Promise<ApiResponse<T>> {
    try {
      const locale = localStorage.getItem('lang') || 'en'
      const res = await fetch(joinPath([this.httpUrl, options.path]), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify(options.body),
        signal: AbortSignal.timeout(this.TIMEOUT_MS),
      })
      return this.handleResponse<T>(res, options)
    } catch {
      return this.handleNetworkError(options)
    }
  }

  private handleNetworkError<T = void>(options: BaseApiServiceOptions<T>): ApiResponse<T> {
    const message = 'Could not connect to the server'

    if (!options.hideToast) {
      showToast(message)
    }

    options.onError?.(message)

    return { success: false, error: message } as ApiResponse<T>
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
