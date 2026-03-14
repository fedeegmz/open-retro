import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { MemoryBoardRepository } from './modules/board/infrastructure/memory/MemoryBoardRepository'
import { MemoryNoteRepository } from './modules/board/infrastructure/memory/MemoryNoteRepository'
import { MemoryNoteGroupRepository } from './modules/board/infrastructure/memory/MemoryNoteGroupRepository'
import { BunHashService } from './modules/shared/infrastructure/services/BunHashService'
import { boardController } from './modules/board/infrastructure/http/boardController'
import { ConsoleLogService } from './modules/shared/infrastructure/services/ConsoleLogService'
import { globalErrorHandler } from './modules/shared/infrastructure/http/globalErrorHandler'
import { ApiResponse } from '@shared/types/api'

const log = new ConsoleLogService()
const boardRepo = new MemoryBoardRepository()
const noteRepo = new MemoryNoteRepository()
const groupRepo = new MemoryNoteGroupRepository()
const hashService = new BunHashService()

const app = new Elysia()
  .use(cors())
  .use(openapi({ path: '/docs' }))
  .use(globalErrorHandler)
  .get('/ping', () => ApiResponse.success())
  .use(boardController({ boardRepo, noteRepo, groupRepo, hashService, log }))
  .listen(3001)

log.info(`Open Retro WS Server running on ws://localhost:${app.server?.port}`)
