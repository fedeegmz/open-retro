import { Elysia, t } from 'elysia'
import { WsMsgType } from '@shared/types/board'
import type { WsMessage, BoardState, ConnectedUser } from '@shared/types/board'
import { BoardMessageHandler } from '../../application/BoardMessageHandler'
import type { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import type { INoteRepository } from '../../domain/repositories/INoteRepository'
import type { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import type { IHashService } from '../../../shared/domain/services/IHashService'
import type { ILogService } from '../../../shared/domain/services/ILogService'
import { CreateBoardSchema } from './schemas/CreateBoardSchema'
import { ApiResponse } from '@shared/types/api'
import { Board } from '../../domain/Board'
import AlreadyExistError from '../../../shared/domain/errors/AlreadyExistError'
import NotFoundError from '../../../shared/domain/errors/NotFoundError'

interface Deps {
  boardRepo: IBoardRepository
  noteRepo: INoteRepository
  groupRepo: INoteGroupRepository
  hashService: IHashService
  log: ILogService
}

export function boardController({ boardRepo, noteRepo, groupRepo, hashService, log }: Deps) {
  const messageHandler = new BoardMessageHandler(boardRepo, noteRepo, groupRepo)
  const clients = new Map<string, Set<any>>()
  const clientInfo = new Map<any, ConnectedUser>()

  return new Elysia({ prefix: '/board' })
    .ws('/ws', {
      query: t.Object({
        board: t.String({ minLength: 1 }),
        password: t.String(),
        username: t.String({ minLength: 1 }),
        clientId: t.String({ minLength: 1 }),
      }),
      async open(ws) {
        const boardId = ws.data.query.board
        const board = await boardRepo.findById(boardId)
        if (!board) {
          ws.close()
          return
        }

        if (!hashService.verify(ws.data.query.password, board.passwordHash)) {
          ws.close(4001, 'Contraseña incorrecta')
          return
        }

        const roomClients = clients.get(boardId) ?? new Set()
        roomClients.add(ws.raw)
        clients.set(boardId, roomClients)

        const user: ConnectedUser = {
          id: ws.data.query.clientId,
          username: ws.data.query.username,
        }
        clientInfo.set(ws.raw, user)

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

        const currentUsers: ConnectedUser[] = []
        for (const raw of roomClients) {
          const info = clientInfo.get(raw)
          if (info) currentUsers.push(info)
        }
        const usersSyncMsg: WsMessage = { type: WsMsgType.UsersSync, users: currentUsers }
        ws.send(JSON.stringify(usersSyncMsg))

        const joinMsg: WsMessage = { type: WsMsgType.UserJoin, user }
        const serializedJoin = JSON.stringify(joinMsg)
        for (const client of roomClients) {
          if (client !== ws.raw) client.send(serializedJoin)
        }

        log.info(`[${boardId}] ${user.username} connected (${roomClients.size} total)`)
      },
      async message(ws, raw) {
        const boardId = ws.data.query.board
        const roomClients = clients.get(boardId)
        if (!roomClients) return

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
          if (note.createdBy && note.createdBy !== ws.data.query.clientId) {
            log.warn(`[${boardId}] Unauthorized note operation by ${ws.data.query.clientId}`)
            return
          }
        }

        if (msg.type === WsMsgType.BoardToggleNotes) {
          const board = await boardRepo.findById(boardId)
          if (board && board.createdBy === ws.data.query.clientId) {
            board.isNotesHidden = msg.isHidden
            await boardRepo.save(board)

            const visibilityMsg: WsMessage = {
              type: WsMsgType.BoardNotesVisibility,
              isHidden: msg.isHidden,
            }

            const rawNotes = await noteRepo.findAll(boardId)
            const groups = await groupRepo.findAll(boardId)

            for (const client of roomClients) {
              const clientUserId = clientInfo.get(client)?.id
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
            const clientUserId = clientInfo.get(client)?.id
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
        const roomClients = clients.get(boardId)
        if (!roomClients) return

        const user = clientInfo.get(ws.raw)
        const wasInRoom = roomClients.delete(ws.raw)
        clientInfo.delete(ws.raw)
        if (!wasInRoom) return

        if (user) {
          const leaveMsg: WsMessage = { type: WsMsgType.UserLeave, userId: user.id }
          const serializedLeave = JSON.stringify(leaveMsg)
          for (const client of roomClients) {
            client.send(serializedLeave)
          }
        }

        log.info(
          `[${boardId}] ${user?.username ?? 'Client'} disconnected (${roomClients.size} remaining)`,
        )

        if (roomClients.size === 0) {
          clients.delete(boardId)
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
            clients.set(boardId, new Set())

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
}
