import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { MemoryBoardRepository } from './modules/board/infrastructure/memory/MemoryBoardRepository'
import { MemoryNoteRepository } from './modules/board/infrastructure/memory/MemoryNoteRepository'
import { MemoryNoteGroupRepository } from './modules/board/infrastructure/memory/MemoryNoteGroupRepository'
import { BunHashService } from './modules/shared/infrastructure/services/BunHashService'
import { boardController } from './modules/board/infrastructure/http/boardController'
import { userController } from './modules/user/infrastructure/http/userController'
import { ConsoleLogService } from './modules/shared/infrastructure/services/ConsoleLogService'
import { globalErrorHandler } from './modules/shared/infrastructure/http/globalErrorHandler'
import { ApiResponse } from '@shared/types/api'
import { i18n } from './modules/shared/infrastructure/services/i18nPlugin'
import { languages } from '@shared/i18n'
import { ServerConfig } from './modules/shared/domain/ServerConfig'

const config = new ServerConfig()

const boardRepository = new MemoryBoardRepository()
const noteRepository = new MemoryNoteRepository()
const groupRepository = new MemoryNoteGroupRepository()
const hashService = new BunHashService()
const logService = new ConsoleLogService()

const app = new Elysia()
  .use(
    cors({
      origin: config.corsOrigins,
    }),
  )
  .use(openapi({ path: '/docs' }))
  .use(i18n)
  .use(globalErrorHandler)
  .get('/ping', () => ApiResponse.success())
  .get('/languages', () => ApiResponse.success(languages))
  .use(userController())
  .use(
    boardController({
      boardRepository,
      noteRepository,
      groupRepository,
      hashService,
      logService,
      config,
    }),
  )
  .listen(config.port)

logService.info(`Open Retro WS Server running on ws://localhost:${app.server?.port}`)
logService.info(
  `Session time limit: ${config.sessionTimeLimitSeconds > 0 ? config.sessionTimeLimitSeconds + 's' : 'Disabled'}`,
)
logService.info(`Admin grace period: ${config.adminGraceSeconds}s`)
