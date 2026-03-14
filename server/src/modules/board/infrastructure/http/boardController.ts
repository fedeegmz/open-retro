import { Elysia } from 'elysia'
import { WsMsgType } from '@shared/types/board'
import type { WsMessage, BoardState, ConnectedUser } from '@shared/types/board'
import { Permission } from '@shared/types/role'
import { PermissionService } from '../../../user/domain/services/PermissionService'
import { BoardMessageHandler } from '../../application/BoardMessageHandler'
import { UserSessionManager } from '../../../user/application/UserSessionManager'
import type { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import type { INoteRepository } from '../../domain/repositories/INoteRepository'
import type { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import type { IHashService } from '../../../shared/domain/services/IHashService'
import type { ILogService } from '../../../shared/domain/services/ILogService'
import { CreateBoardSchema } from './schemas/CreateBoardSchema'
import { WebSocketQuerySchema } from './schemas/WebSocketQuerySchema'
import { ExportBoardQuerySchema } from './schemas/ExportBoardSchema'
import { ApiResponse } from '@shared/types/api'
import { Board } from '../../domain/Board'
import AlreadyExistError from '../../../shared/domain/errors/AlreadyExistError'
import NotFoundError from '../../../shared/domain/errors/NotFoundError'
import { JsonExportBoardUseCase } from '../../application/useCases/JsonExportBoardUseCase'
import InvalidArgError from '../../../shared/domain/errors/InvalidArgError'

interface Deps {
  boardRepository: IBoardRepository
  noteRepository: INoteRepository
  groupRepository: INoteGroupRepository
  hashService: IHashService
  logService: ILogService
}

export function boardController({
  boardRepository: boardRepo,
  noteRepository: noteRepo,
  groupRepository: groupRepo,
  hashService,
  logService: log,
}: Deps) {
  const messageHandler = new BoardMessageHandler(boardRepo, noteRepo, groupRepo)
  const sessionManager = new UserSessionManager(log)
  const jsonExportBoardUseCase = new JsonExportBoardUseCase(boardRepo, noteRepo, groupRepo)

  return new Elysia({ prefix: '/board' })
    .ws('/ws', {
      query: WebSocketQuerySchema,
      async open(ws) {
        const boardId = ws.data.query.board
        let board: Board
        try {
          board = await boardRepo.findById(boardId)
        } catch (e) {
          if (e instanceof NotFoundError) {
            log.error(`[${boardId}] Failed to find board: ${e}`)
            ws.close()
            return
          }
          log.error(`[${boardId}] Unknown error: ${e}`)
          throw e
        }

        if (!hashService.verify(ws.data.query.password, board.passwordHash)) {
          ws.close(4001, 'Invalid password')
          return
        }

        const role = sessionManager.computeRole(ws.data.query.clientId, board.createdBy)
        const user: ConnectedUser = {
          id: ws.data.query.clientId,
          username: ws.data.query.username,
          role,
        }

        sessionManager.joinRoom(boardId, ws.raw, user)

        const rawNotes = await noteRepo.findAll(boardId)
        const maskedNotes = board.isNotesHidden
          ? rawNotes.map((note) => ({
              ...note,
              text: note.createdBy === ws.data.query.clientId ? note.text : '',
            }))
          : rawNotes

        const state: BoardState = {
          notes: maskedNotes,
          groups: await groupRepo.findAll(boardId),
          nextZIndex: board.nextZIndex,
          isNotesHidden: board.isNotesHidden,
          createdBy: board.createdBy,
        }
        const syncMsg: WsMessage = { type: WsMsgType.BoardSync, state }
        ws.send(JSON.stringify(syncMsg))

        const currentUsers = sessionManager.getRoomUsers(boardId)
        const usersSyncMsg: WsMessage = { type: WsMsgType.UsersSync, users: currentUsers }
        ws.send(JSON.stringify(usersSyncMsg))

        const joinMsg: WsMessage = { type: WsMsgType.UserJoin, user }
        sessionManager.broadcastToRoom(boardId, joinMsg, ws.raw)
      },
      async message(ws, raw) {
        const boardId = ws.data.query.board
        const roomClients = sessionManager.getRoomClients(boardId)
        if (!roomClients) return

        const user = sessionManager.getUser(ws.raw)
        if (!user) return

        let msg: WsMessage
        try {
          msg = (typeof raw === 'string' ? JSON.parse(raw) : raw) as WsMessage
        } catch (e) {
          log.error(`[${boardId}] Failed to parse WS message: ${e}`)
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
          const note = await noteRepo.findById(boardId, noteId)
          if (note.createdBy && !PermissionService.canModifyResource(user, note.createdBy)) {
            log.warn(`[${boardId}] Unauthorized note operation by ${user.username}`)
            return
          }
        }

        if (msg.type === WsMsgType.BoardToggleNotes) {
          const board = await boardRepo.findById(boardId)
          if (board && PermissionService.can(user.role, Permission.ToggleNoteVisibility)) {
            board.isNotesHidden = msg.isHidden
            await boardRepo.save(board)

            const visibilityMsg: WsMessage = {
              type: WsMsgType.BoardNotesVisibility,
              isHidden: msg.isHidden,
            }

            const rawNotes = await noteRepo.findAll(boardId)
            const groups = await groupRepo.findAll(boardId)

            for (const client of roomClients) {
              const clientUserId = sessionManager.getUser(client)?.id
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

        messageHandler.handle(boardId, msg)

        const board = await boardRepo.findById(boardId)
        const isHidden = board?.isNotesHidden

        for (const client of roomClients) {
          if (client !== ws.raw) {
            const clientUserId = sessionManager.getUser(client)?.id
            let clientMsg = msg

            if (isHidden) {
              if (msg.type === WsMsgType.NoteAdd) {
                if (msg.note.createdBy !== clientUserId) {
                  clientMsg = { ...msg, note: { ...msg.note, text: '' } }
                }
              } else if (msg.type === WsMsgType.NoteEdit) {
                const note = await noteRepo.findById(boardId, msg.id)
                if (note && note.createdBy !== clientUserId) {
                  clientMsg = { ...msg, text: '' }
                }
              }
            }

            client.send(JSON.stringify(clientMsg))
          }
        }
      },
      async close(ws) {
        const boardId = ws.data.query.board

        const { user, roomEmpty } = sessionManager.leaveRoom(boardId, ws.raw)

        if (user) {
          const leaveMsg: WsMessage = { type: WsMsgType.UserLeave, userId: user.id }
          sessionManager.broadcastToRoom(boardId, leaveMsg)
        }

        if (roomEmpty) {
          await boardRepo.delete(boardId)
          await noteRepo.deleteAll(boardId)
          await groupRepo.deleteAll(boardId)
          log.info(`[${boardId}] Room cleaned up`)
        }
      },
    })
    .post(
      '/',
      async ({ body }) => {
        const { boardId, password, clientId } = body
        try {
          await boardRepo.findById(boardId)
        } catch (e) {
          if (e instanceof NotFoundError) {
            await boardRepo.save(new Board(boardId, hashService.hash(password), clientId))

            return ApiResponse.success({ boardId })
          }
        }

        throw new AlreadyExistError(`Board ${boardId} already exists`)
      },
      {
        body: CreateBoardSchema,
      },
    )
    .post(
      '/join',
      async ({ body }) => {
        const { boardId, password } = body

        const board = await boardRepo.findById(boardId)

        if (!hashService.verify(password, board.passwordHash)) {
          return ApiResponse.error('Invalid password')
        }

        return ApiResponse.success({ boardId })
      },
      {
        body: CreateBoardSchema,
      },
    )
    .get('/exists/:id', async ({ params: { id } }) => {
      const board = await boardRepo.findById(id)

      return ApiResponse.success({ boardId: board.id })
    })
    .get(
      '/:id/export',
      async ({ params: { id }, query }) => {
        let exportedData
        switch (query.format) {
          case 'json':
          case undefined:
            exportedData = await jsonExportBoardUseCase.execute(id)
            break
          default:
            throw new InvalidArgError(`Unsupported format: ${query.format}`)
        }

        return ApiResponse.success(exportedData)
      },
      {
        query: ExportBoardQuerySchema,
      },
    )
}
