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

        const state: BoardState = {
          notes: await noteRepo.findAll(boardId),
          groups: await groupRepo.findAll(boardId),
          nextZIndex: board.nextZIndex,
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

        messageHandler.handle(boardId, msg)

        const serialized = JSON.stringify(msg)
        for (const client of roomClients) {
          if (client !== ws.raw) client.send(serialized)
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
        const { boardId, password } = body

        await boardRepo.save(new Board(boardId, hashService.hash(password)))
        clients.set(boardId, new Set())

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
