import { BaseApiService } from './baseApiService'

interface CreateBoardOptions {
  boardId: string
  password: string
  onSuccess?: () => void
  onError?: (message: string) => void
}

interface GetBoardOptions {
  boardId: string
  onSuccess?: () => void
  onError?: (message: string) => void
}

export class BoardService extends BaseApiService {
  async create({ boardId, password, onSuccess, onError }: CreateBoardOptions): Promise<void> {
    await this.post({ path: '/board', body: { boardId, password }, onSuccess, onError })
  }

  async getBoard({ boardId, onSuccess, onError }: GetBoardOptions): Promise<void> {
    await this.get({ path: `/board/exists/${boardId}`, onSuccess, onError })
  }
}
