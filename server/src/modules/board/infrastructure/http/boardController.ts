import { Elysia, t } from 'elysia'
import { WsMsgType } from '@shared/types/board'
import type { WsMessage, BoardState } from '@shared/types/board'
import { Board } from '../../domain/Board'
import { BoardMessageHandler } from '../../application/BoardMessageHandler'
import type { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import type { INoteRepository } from '../../domain/repositories/INoteRepository'
import type { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import type { IHashService } from '../../../shared/domain/services/IHashService'
import type { ILogService } from '../../../shared/domain/services/ILogService'

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

  return new Elysia({ prefix: '/board' })
    .ws('/ws', {
      query: t.Object({
        board: t.String({ minLength: 1 }),
        password: t.String(),
      }),
      open(ws) {
        const boardId = ws.data.query.board
        const board = boardRepo.findById(boardId)
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

        const state: BoardState = {
          notes: noteRepo.findAll(boardId),
          groups: groupRepo.findAll(boardId),
          nextZIndex: board.nextZIndex,
        }
        const syncMsg: WsMessage = { type: WsMsgType.BoardSync, state }
        ws.send(JSON.stringify(syncMsg))

        log.info(`[${boardId}] Client connected (${roomClients.size} total)`)
      },
      message(ws, raw) {
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
        messageHandler.handle(boardId, msg)

        const serialized = JSON.stringify(msg)
        for (const client of roomClients) {
          if (client !== ws.raw) client.send(serialized)
        }
      },
      close(ws) {
        const boardId = ws.data.query.board
        const roomClients = clients.get(boardId)
        if (!roomClients) return

        const wasInRoom = roomClients.delete(ws.raw)
        if (!wasInRoom) return

        log.info(`[${boardId}] Client disconnected (${roomClients.size} remaining)`)

        if (roomClients.size === 0) {
          clients.delete(boardId)
          boardRepo.delete(boardId)
          noteRepo.deleteAll(boardId)
          groupRepo.deleteAll(boardId)
          log.info(`[${boardId}] Room cleaned up`)
        }
      },
    })
    .post(
      '/',
      ({ body, set }) => {
        const { boardId, password } = body
        log.info(`Creando board [${boardId}] with password: ${password}`)

        if (boardRepo.exists(boardId)) {
          log.warn(`Ya existe board [${boardId}]`)
          set.status = 409
          return { error: 'Ya existe un board con ese ID' }
        }

        boardRepo.save(new Board(boardId, hashService.hash(password)))
        clients.set(boardId, new Set())
        log.info(`Board [${boardId}] creado`)
        return { ok: true, boardId }
      },
      {
        body: t.Object({
          boardId: t.String({ minLength: 1 }),
          password: t.String({ minLength: 1 }),
        }),
      },
    )
    .get('/exists/:id', ({ params: { id }, set }) => {
      log.info(`Verificando existencia de board [${id}]`)
      if (!boardRepo.exists(id)) {
        log.warn(`Board [${id}] no encontrado`)
        set.status = 404
        return { error: 'Board no encontrado' }
      }
      log.info(`Board [${id}] encontrado`)
      return { ok: true, boardId: id }
    })
}
