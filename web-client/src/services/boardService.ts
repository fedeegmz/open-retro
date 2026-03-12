import { BaseApiService } from './baseApiService'

export class BoardService extends BaseApiService {
  async create(boardId: string, password: string): Promise<void> {
    await this.post({ path: '/board', body: { boardId, password } })
  }

  async getBoard(boardId: string, onError?: (message: string) => void): Promise<void> {
    await this.get({ path: `/board/exists/${boardId}`, onError })
  }
}
