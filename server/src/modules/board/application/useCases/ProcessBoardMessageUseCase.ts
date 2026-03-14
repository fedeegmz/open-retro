import { WsMsgType } from '@shared/types/board'
import type { WsMessage, BoardState } from '@shared/types/board'
import type { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import type { INoteRepository } from '../../domain/repositories/INoteRepository'
import type { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import type { ILogService } from '../../../shared/domain/services/ILogService'
import type { UserSessionManager } from '../../../user/application/UserSessionManager'
import type { IWebSocketClient } from '../../../shared/domain/IWebSocketClient'
import type { BoardMessageHandler } from '../BoardMessageHandler'
import { PermissionService } from '../../../user/domain/services/PermissionService'
import { Permission } from '@shared/types/role'

export class ProcessBoardMessageUseCase {
  constructor(
    private readonly boardRepository: IBoardRepository,
    private readonly noteRepository: INoteRepository,
    private readonly groupRepository: INoteGroupRepository,
    private readonly logService: ILogService,
    private readonly sessionManager: UserSessionManager,
    private readonly messageHandler: BoardMessageHandler,
  ) {}

  async execute(ws: IWebSocketClient, boardId: string, raw: string | unknown): Promise<void> {
    const roomClients = this.sessionManager.getRoomClients(boardId)
    if (!roomClients) return

    const user = this.sessionManager.getUser(ws)
    if (!user) return

    let msg: WsMessage
    try {
      msg = (typeof raw === 'string' ? JSON.parse(raw) : raw) as WsMessage
    } catch (e) {
      this.logService.error(`[${boardId}] Failed to parse WS message: ${e}`)
      return
    }

    const noteOwnershipOps = new Set([
      WsMsgType.NoteEdit,
      WsMsgType.NoteMove,
      WsMsgType.NoteResize,
      WsMsgType.NoteDelete,
      WsMsgType.NoteZ,
    ])
    if (noteOwnershipOps.has(msg.type)) {
      const noteId = (msg as { id: string }).id
      const note = await this.noteRepository.findById(boardId, noteId)
      if (note.createdBy && !PermissionService.canModifyResource(user, note.createdBy)) {
        this.logService.warn(`[${boardId}] Unauthorized note operation by ${user.username}`)
        return
      }
    }

    if (msg.type === WsMsgType.BoardToggleNotes) {
      const board = await this.boardRepository.findById(boardId)
      if (board && PermissionService.can(user.role, Permission.ToggleNoteVisibility)) {
        board.isNotesHidden = msg.isHidden
        await this.boardRepository.save(board)

        const visibilityMsg: WsMessage = {
          type: WsMsgType.BoardNotesVisibility,
          isHidden: msg.isHidden,
        }

        const rawNotes = await this.noteRepository.findAll(boardId)
        const groups = await this.groupRepository.findAll(boardId)

        for (const client of roomClients) {
          const clientUserId = this.sessionManager.getUser(client)?.id
          const maskedNotes = msg.isHidden
            ? rawNotes.map((n) => ({
                ...n,
                text: n.createdBy === clientUserId ? n.text : '',
              }))
            : rawNotes

          const state: BoardState = {
            notes: maskedNotes,
            groups,
            nextZIndex: board.nextZIndex,
            isNotesHidden: board.isNotesHidden,
            createdBy: board.createdBy,
          }
          client.send(JSON.stringify({ type: WsMsgType.BoardSync, state }))
          client.send(JSON.stringify(visibilityMsg))
        }
      }
      return
    }

    await this.messageHandler.handle(boardId, msg)

    const board = await this.boardRepository.findById(boardId)
    const isHidden = board?.isNotesHidden

    for (const client of roomClients) {
      if (client !== ws) {
        const clientUserId = this.sessionManager.getUser(client)?.id
        let clientMsg = msg

        if (isHidden) {
          if (msg.type === WsMsgType.NoteAdd) {
            if (msg.note.createdBy !== clientUserId) {
              clientMsg = { ...msg, note: { ...msg.note, text: '' } }
            }
          } else if (msg.type === WsMsgType.NoteEdit) {
            const note = await this.noteRepository.findById(boardId, msg.id)
            if (note && note.createdBy !== clientUserId) {
              clientMsg = { ...msg, text: '' }
            }
          }
        }

        client.send(JSON.stringify(clientMsg))
      }
    }
  }
}
