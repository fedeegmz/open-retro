import { WsMsgType } from '@shared/types/board'
import type { WsMessage } from '@shared/types/board'
import type { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import type { INoteRepository } from '../../domain/repositories/INoteRepository'
import type { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import type { ILogService } from '../../../shared/domain/services/ILogService'
import type { UserSessionManager } from '../../../user/application/UserSessionManager'
import type { IWebSocketClient } from '../../../shared/domain/IWebSocketClient'

export class LeaveBoardUseCase {
  constructor(
    private readonly boardRepository: IBoardRepository,
    private readonly noteRepository: INoteRepository,
    private readonly groupRepository: INoteGroupRepository,
    private readonly logService: ILogService,
    private readonly sessionManager: UserSessionManager,
  ) {}

  async execute(ws: IWebSocketClient, boardId: string): Promise<void> {
    const { user, roomEmpty } = this.sessionManager.leaveRoom(boardId, ws)

    if (user) {
      const leaveMsg: WsMessage = { type: WsMsgType.UserLeave, userId: user.id }
      this.sessionManager.broadcastToRoom(boardId, leaveMsg)
    }

    if (roomEmpty) {
      const board = await this.boardRepository.findById(boardId)
      if (board.isExpired) {
        this.logService.info(
          `[${boardId}] Room is empty but board is expired. Keeping it for grace period.`,
        )
        return
      }

      await this.boardRepository.delete(boardId)
      await this.noteRepository.deleteAll(boardId)
      await this.groupRepository.deleteAll(boardId)
      this.logService.info(`[${boardId}] Room cleaned up`)
    }
  }
}
