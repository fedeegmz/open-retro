import { Elysia } from 'elysia'
import { JoinBoardUseCase } from '../../application/useCases/JoinBoardUseCase'
import { ProcessBoardMessageUseCase } from '../../application/useCases/ProcessBoardMessageUseCase'
import { LeaveBoardUseCase } from '../../application/useCases/LeaveBoardUseCase'
import type { IWebSocketClient } from '../../../shared/domain/IWebSocketClient'
import { BoardMessageHandler } from '../../application/BoardMessageHandler'
import { BoardSessionTimerService } from '../../domain/services/BoardSessionTimerService'
import type { ServerConfig } from '../../../shared/domain/ServerConfig'
import { UserSessionManager } from '../../../user/application/UserSessionManager'
import type { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import type { INoteRepository } from '../../domain/repositories/INoteRepository'
import type { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import type { IHashService } from '../../../shared/domain/services/IHashService'
import type { ILogService } from '../../../shared/domain/services/ILogService'
import { CreateBoardSchema } from './schemas/CreateBoardSchema'
import { WebSocketQuerySchema } from './schemas/WebSocketQuerySchema'
import { ExportBoardQuerySchema } from './schemas/ExportBoardSchema'
import { ApiResponse } from '@open-retro/shared/types/api'
import { Board } from '../../domain/Board'
import AlreadyExistError from '../../../shared/domain/errors/AlreadyExistError'
import NotFoundError from '../../../shared/domain/errors/NotFoundError'
import { JsonExportBoardUseCase } from '../../application/useCases/JsonExportBoardUseCase'
import { JsonImportBoardUseCase } from '../../application/useCases/JsonImportBoardUseCase'
import { ImportBoardSchema } from './schemas/ImportBoardSchema'
import InvalidArgError from '../../../shared/domain/errors/InvalidArgError'
import { WsMsgType } from '@open-retro/shared/types/board'
import type { WsMessage, BoardState } from '@open-retro/shared/types/board'

interface Deps {
  boardRepository: IBoardRepository
  noteRepository: INoteRepository
  groupRepository: INoteGroupRepository
  hashService: IHashService
  logService: ILogService
  config: ServerConfig
}

export function boardController({
  boardRepository,
  noteRepository,
  groupRepository,
  hashService,
  logService,
  config,
}: Deps) {
  const messageHandler = new BoardMessageHandler(boardRepository, noteRepository, groupRepository)
  const sessionManager = new UserSessionManager(logService)
  const boardSessionTimer = new BoardSessionTimerService(config)
  const jsonExportBoardUseCase = new JsonExportBoardUseCase(
    boardRepository,
    noteRepository,
    groupRepository,
  )
  const jsonImportBoardUseCase = new JsonImportBoardUseCase(
    boardRepository,
    noteRepository,
    groupRepository,
    hashService,
  )

  const joinBoardUseCase = new JoinBoardUseCase(
    boardRepository,
    noteRepository,
    groupRepository,
    hashService,
    logService,
    sessionManager,
    config,
  )
  const processBoardMessageUseCase = new ProcessBoardMessageUseCase(
    boardRepository,
    noteRepository,
    groupRepository,
    logService,
    sessionManager,
    messageHandler,
  )
  const leaveBoardUseCase = new LeaveBoardUseCase(
    boardRepository,
    noteRepository,
    groupRepository,
    logService,
    sessionManager,
  )

  /** In-memory tracking of grace period timers (boardId → timer) */
  const gracePeriodTimers = new Map<string, ReturnType<typeof setTimeout>>()

  async function deleteBoardData(boardId: string): Promise<void> {
    try {
      await boardRepository.delete(boardId)
      await noteRepository.deleteAll(boardId)
      await groupRepository.deleteAll(boardId)
      logService.info(`[${boardId}] Board data deleted after session expiry grace period`)
    } catch (e) {
      logService.error(`[${boardId}] Error deleting board data after grace period: ${e}`)
    }
  }

  function startGracePeriod(boardId: string): void {
    logService.info(
      `[${boardId}] Starting grace period of ${config.adminGraceSeconds}s before data deletion`,
    )
    const timer = setTimeout(async () => {
      gracePeriodTimers.delete(boardId)
      await deleteBoardData(boardId)
    }, config.adminGraceSeconds * 1000)
    gracePeriodTimers.set(boardId, timer)
  }

  function cancelGracePeriod(boardId: string): void {
    const timer = gracePeriodTimers.get(boardId)
    if (timer !== undefined) {
      clearTimeout(timer)
      gracePeriodTimers.delete(boardId)
    }
  }

  async function onSessionExpired(boardId: string): Promise<void> {
    logService.info(`[${boardId}] Session time limit reached`)

    let board
    try {
      board = await boardRepository.findById(boardId)
    } catch {
      return
    }

    board.isExpired = true
    await boardRepository.save(board)

    const expiredMsg: WsMessage = { type: WsMsgType.SessionExpired }
    sessionManager.broadcastToRoom(boardId, expiredMsg)

    startGracePeriod(boardId)
  }

  return new Elysia({ prefix: '/board' })
    .ws('/ws', {
      query: WebSocketQuerySchema,
      async open(ws) {
        const client = ws.raw as unknown as IWebSocketClient
        await joinBoardUseCase.execute(client, {
          boardId: ws.data.query.board,
          password: ws.data.query.password,
          clientId: ws.data.query.clientId,
          username: ws.data.query.username,
        })
      },
      async message(ws, raw) {
        const client = ws.raw as unknown as IWebSocketClient
        await processBoardMessageUseCase.execute(client, ws.data.query.board, raw)
      },
      async close(ws) {
        const client = ws.raw as unknown as IWebSocketClient
        await leaveBoardUseCase.execute(client, ws.data.query.board)
      },
    })
    .post(
      '/',
      async ({ body }) => {
        const { boardId, password, clientId } = body
        try {
          await boardRepository.findById(boardId)
        } catch (e) {
          if (e instanceof NotFoundError) {
            await boardRepository.save(new Board(boardId, hashService.hash(password), clientId))

            boardSessionTimer.start(boardId, () => onSessionExpired(boardId))

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

        const board = await boardRepository.findById(boardId)

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
      const board = await boardRepository.findById(id)

      return ApiResponse.success({ boardId: board.id })
    })
    .get(
      '/:id/export',
      async ({ params: { id }, query }) => {
        // Exporting cancels the grace-period auto-delete so admin data is preserved
        cancelGracePeriod(id)

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
    .post(
      '/import',
      async ({ body }) => {
        const { boardId, password, clientId, data } = body
        await jsonImportBoardUseCase.execute(boardId, password, clientId, data)

        const board = await boardRepository.findById(boardId)
        const state: BoardState = {
          notes: await noteRepository.findAll(boardId),
          groups: await groupRepository.findAll(boardId),
          nextZIndex: board.nextZIndex,
          isNotesHidden: board.isNotesHidden,
          createdBy: board.createdBy,
          voting: board.voting,
        }
        const syncMsg: WsMessage = { type: WsMsgType.BoardSync, state }
        sessionManager.broadcastToRoom(boardId, syncMsg)

        return ApiResponse.success({ boardId })
      },
      {
        body: ImportBoardSchema,
      },
    )
}
