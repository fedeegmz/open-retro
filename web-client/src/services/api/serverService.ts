import { BaseApiService } from './baseApiService'

export class ServerService extends BaseApiService {
  async ping(): Promise<void> {
    await this.get({ path: '/ping' })
  }
}
