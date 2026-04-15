import { BaseApiService } from './baseApiService'
import type { GenerateNameResponse } from '@open-retro/shared/types/user'

export class UserService extends BaseApiService {
  async generateName(
    onSuccess?: (data: GenerateNameResponse) => void,
    onError?: (message: string) => void,
  ): Promise<void> {
    await this.get<GenerateNameResponse>({
      path: '/users/generate-name',
      onSuccess: (res) => {
        if (res.data) onSuccess?.(res.data)
      },
      onError,
      hideToast: true,
    })
  }
}
