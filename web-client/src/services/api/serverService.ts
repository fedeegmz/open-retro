import { BaseApiService } from './baseApiService'
import { ApiResponse } from '@open-retro/shared/types/api'

interface PingOptions {
  onSuccess?: () => void
  onError?: (message: string) => void
}

interface Language {
  code: string
  name: string
}

export class ServerService extends BaseApiService {
  async ping({ onSuccess, onError }: PingOptions): Promise<void> {
    await this.get({ path: '/ping', hideToast: true, onSuccess, onError })
  }

  async getLanguages(): Promise<ApiResponse<Language[]>> {
    return await this.get<Language[]>({ path: '/languages', hideToast: true })
  }
}
