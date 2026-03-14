import { Elysia } from 'elysia'
import { JoinBoardUseCase } from '../../application/useCases/JoinBoardUseCase'
import { ProcessBoardMessageUseCase } from '../../application/useCases/ProcessBoardMessageUseCase'
import { LeaveBoardUseCase } from '../../application/useCases/LeaveBoardUseCase'
import type { IWebSocketClient } from '../../../shared/domain/IWebSocketClient'
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

  const joinBoardUseCase = new JoinBoardUseCase(
    boardRepo,
    noteRepo,
    groupRepo,
    hashService,
    log,
    sessionManager,
  )
  const processBoardMessageUseCase = new ProcessBoardMessageUseCase(
    boardRepo,
    noteRepo,
    groupRepo,
    log,
    sessionManager,
    messageHandler,
  )
  const leaveBoardUseCase = new LeaveBoardUseCase(
    boardRepo,
    noteRepo,
    groupRepo,
    log,
    sessionManager,
  )

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
