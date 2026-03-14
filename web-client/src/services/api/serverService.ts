import { BaseApiService } from './baseApiService'

interface PingOptions {
  onSuccess?: () => void
  onError?: (message: string) => void
}

export class ServerService extends BaseApiService {
  async ping({ onSuccess, onError }: PingOptions): Promise<void> {
    await this.get({ path: '/ping', hideToast: true, onSuccess, onError })
  }
}
