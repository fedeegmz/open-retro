import { BaseApiService } from './baseApiService'

interface CreateBoardOptions {
  boardId: string
  password: string
  clientId?: string
  onSuccess?: () => void
  onError?: (message: string) => void
}

interface GetBoardOptions {
  boardId: string
  onSuccess?: () => void
  onError?: (message: string) => void
}

export class BoardService extends BaseApiService {
  async create({
    boardId,
    password,
    clientId,
    onSuccess,
    onError,
  }: CreateBoardOptions): Promise<void> {
    await this.post({ path: '/board', body: { boardId, password, clientId }, onSuccess, onError })
  }

  async join({
    boardId,
    password,
    clientId,
    onSuccess,
    onError,
  }: CreateBoardOptions): Promise<void> {
    await this.post({
      path: '/board/join',
      body: { boardId, password, clientId },
      hideToast: true,
      onSuccess,
      onError,
    })
  }

  async getBoard({ boardId, onSuccess, onError }: GetBoardOptions): Promise<void> {
    await this.get({ path: `/board/exists/${boardId}`, onSuccess, onError })
  }

  async exportBoard({
    boardId,
    onSuccess,
    onError,
  }: {
    boardId: string
    onSuccess?: (data: unknown) => void
    onError?: (message: string) => void
  }): Promise<void> {
    await this.get<unknown>({
      path: `/board/${boardId}/export?format=json`,
      onSuccess: (res) => onSuccess?.(res.data),
      onError,
    })
  }

  async importBoard({
    boardId,
    password,
    clientId,
    data,
    onSuccess,
    onError,
  }: {
    boardId: string
    password: string
    clientId: string
    data: unknown
    onSuccess?: () => void
    onError?: (message: string) => void
  }): Promise<void> {
    await this.post({
      path: '/board/import',
      body: { boardId, password, clientId, data },
      onSuccess,
      onError,
    })
  }
}
