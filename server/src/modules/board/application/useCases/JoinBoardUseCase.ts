import { WsMsgType } from '@shared/types/board'
import type { WsMessage, BoardState, ConnectedUser } from '@shared/types/board'
import type { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import type { INoteRepository } from '../../domain/repositories/INoteRepository'
import type { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import type { IHashService } from '../../../shared/domain/services/IHashService'
import type { ILogService } from '../../../shared/domain/services/ILogService'
import type { UserSessionManager } from '../../../user/application/UserSessionManager'
import type { IWebSocketClient } from '../../../shared/domain/IWebSocketClient'
import NotFoundError from '../../../shared/domain/errors/NotFoundError'
import type { JoinBoardDTO } from '../dtos/JoinBoardDTO'
import { I18nService } from '../../../shared/infrastructure/services/I18nService'

export class JoinBoardUseCase {
  constructor(
    private readonly boardRepository: IBoardRepository,
    private readonly noteRepository: INoteRepository,
    private readonly groupRepository: INoteGroupRepository,
    private readonly hashService: IHashService,
    private readonly logService: ILogService,
    private readonly sessionManager: UserSessionManager,
    private readonly i18n: I18nService = new I18nService(),
  ) {}

  async execute(ws: IWebSocketClient, data: JoinBoardDTO): Promise<void> {
    let board
    try {
      board = await this.boardRepository.findById(data.boardId)
    } catch (e) {
      if (e instanceof NotFoundError) {
        this.logService.error(`[${data.boardId}] Failed to find board: ${e}`)
        ws.close()
        return
      }
      this.logService.error(`[${data.boardId}] Unknown error: ${e}`)
      throw e
    }

    if (!this.hashService.verify(data.password, board.passwordHash)) {
      ws.close(4001, this.i18n.t('ws_close.invalid_password'))
      return
    }

    if (board.isExpired) {
      ws.close(4002, this.i18n.t('ws_close.session_expired'))
      return
    }

    const role = this.sessionManager.computeRole(data.clientId, board.createdBy)
    const user: ConnectedUser = {
      id: data.clientId,
      username: data.username,
      role,
    }

    this.sessionManager.joinRoom(data.boardId, ws, user)

    const rawNotes = await this.noteRepository.findAll(data.boardId)
    const maskedNotes = board.isNotesHidden
      ? rawNotes.map((note) => ({
          ...note,
          text: note.createdBy === data.clientId ? note.text : '',
        }))
      : rawNotes

    const state: BoardState = {
      notes: maskedNotes,
      groups: await this.groupRepository.findAll(data.boardId),
      nextZIndex: board.nextZIndex,
      isNotesHidden: board.isNotesHidden,
      createdBy: board.createdBy,
    }
    const syncMsg: WsMessage = { type: WsMsgType.BoardSync, state }
    ws.send(JSON.stringify(syncMsg))

    const currentUsers = this.sessionManager.getRoomUsers(data.boardId)
    const usersSyncMsg: WsMessage = { type: WsMsgType.UsersSync, users: currentUsers }
    ws.send(JSON.stringify(usersSyncMsg))

    const joinMsg: WsMessage = { type: WsMsgType.UserJoin, user }
    this.sessionManager.broadcastToRoom(data.boardId, joinMsg, ws)
  }
}
