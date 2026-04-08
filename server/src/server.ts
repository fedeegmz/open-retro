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
import { i18n } from './modules/shared/infrastructure/services/i18nPlugin'
import { languages } from '@shared/i18n'

const boardRepository = new MemoryBoardRepository()
const noteRepository = new MemoryNoteRepository()
const groupRepository = new MemoryNoteGroupRepository()
const hashService = new BunHashService()
const logService = new ConsoleLogService()

const app = new Elysia()
  .use(cors())
  .use(openapi({ path: '/docs' }))
  .use(i18n)
  .use(globalErrorHandler)
  .get('/ping', () => ApiResponse.success())
  .get('/languages', () => ApiResponse.success(languages))
  .use(
    boardController({
      boardRepository,
      noteRepository,
      groupRepository,
      hashService,
      logService,
    }),
  )
  .listen(Number(process.env.PORT) || 3001)

logService.info(`Open Retro WS Server running on ws://localhost:${app.server?.port}`)
