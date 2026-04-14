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

    const board = await this.boardRepository.findById(boardId)
    if (!board) return
    if (board.isExpired) {
      this.logService.warn(`[${boardId}] Rejected message on expired board from ${user.username}`)
      return
    }

    const noteOwnershipOps = new Set([
      WsMsgType.NoteEdit,
      WsMsgType.NoteResize,
      WsMsgType.NoteDelete,
    ])

    if (msg.type === WsMsgType.NoteMove || msg.type === WsMsgType.NoteZ) {
      if (!PermissionService.can(user.role, Permission.MoveAnyNote)) {
        this.logService.warn(
          `[${boardId}] Unauthorized note operation (${msg.type}) by ${user.username}`,
        )
        return
      }
    } else if (noteOwnershipOps.has(msg.type)) {
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
            voting: board.voting,
          }
          client.send(JSON.stringify({ type: WsMsgType.BoardSync, state }))
          client.send(JSON.stringify(visibilityMsg))
        }
      }
      return
    }

    if (msg.type === WsMsgType.BoardVotingStart) {
      if (PermissionService.canModifyResource(user, board.createdBy)) {
        board.voting = { active: true, maxVotesPerUser: (msg as any).maxVotesPerUser }
        await this.boardRepository.save(board)
        roomClients.forEach((client) => client.send(JSON.stringify(msg)))
      }
      return
    }

    if (msg.type === WsMsgType.BoardVotingPause) {
      if (PermissionService.canModifyResource(user, board.createdBy)) {
        board.voting = { active: false, maxVotesPerUser: board.voting.maxVotesPerUser }
        await this.boardRepository.save(board)
        roomClients.forEach((client) => client.send(JSON.stringify(msg)))
      }
      return
    }

    if (msg.type === WsMsgType.BoardVotingReset) {
      if (PermissionService.canModifyResource(user, board.createdBy)) {
        board.voting = { active: false, maxVotesPerUser: 0 }
        await this.boardRepository.save(board)
        const allNotes = await this.noteRepository.findAll(boardId)
        for (const note of allNotes) {
          if (note.votedBy && note.votedBy.length > 0) {
            note.votedBy = []
            await this.noteRepository.save(boardId, note)
          }
        }
        roomClients.forEach((client) => client.send(JSON.stringify(msg)))
      }
      return
    }

    if (msg.type === WsMsgType.NoteVote) {
      if (!board.voting?.active) return
      const allNotes = await this.noteRepository.findAll(boardId)
      const userVotesCast = allNotes.reduce(
        (acc, n) => acc + (n.votedBy?.includes(user.id) ? 1 : 0),
        0,
      )

      if (userVotesCast >= board.voting.maxVotesPerUser) {
        this.logService.warn(`[${boardId}] User ${user.username} exceeded max votes.`)
        return
      }

      const note = await this.noteRepository.findById(boardId, (msg as any).id)
      if (!note) return

      if (!note.votedBy) note.votedBy = []
      if (!note.votedBy.includes(user.id)) {
        note.votedBy.push(user.id)
        await this.noteRepository.save(boardId, note)
        msg = { ...msg, userId: user.id } as any
      } else {
        return
      }
    }

    if (msg.type === WsMsgType.NoteUnvote) {
      if (!board.voting?.active) return
      const note = await this.noteRepository.findById(boardId, (msg as any).id)
      if (!note || !note.votedBy) return

      if (note.votedBy.includes(user.id)) {
        note.votedBy = note.votedBy.filter((id) => id !== user.id)
        await this.noteRepository.save(boardId, note)
        msg = { ...msg, userId: user.id } as any
      } else {
        return
      }
    }

    await this.messageHandler.handle(boardId, msg)

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
