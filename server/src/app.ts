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
import { ApiResponse } from '@open-retro/shared/types/api'
import { i18n } from './modules/shared/infrastructure/services/i18nPlugin'
import { languages } from '@open-retro/shared/i18n'
import { ServerConfig } from './modules/shared/domain/ServerConfig'
import type { IBoardRepository } from './modules/board/domain/repositories/IBoardRepository'
import type { INoteRepository } from './modules/board/domain/repositories/INoteRepository'
import type { INoteGroupRepository } from './modules/board/domain/repositories/INoteGroupRepository'
import type { IHashService } from './modules/shared/domain/services/IHashService'
import type { ILogService } from './modules/shared/domain/services/ILogService'

export interface OpenRetroAppDeps {
  boardRepository?: IBoardRepository
  noteRepository?: INoteRepository
  groupRepository?: INoteGroupRepository
  hashService?: IHashService
  logService?: ILogService
  config: ServerConfig
}

export function createOpenRetroApp(deps: OpenRetroAppDeps) {
  const { config } = deps
  const boardRepository = deps.boardRepository ?? new MemoryBoardRepository()
  const noteRepository = deps.noteRepository ?? new MemoryNoteRepository()
  const groupRepository = deps.groupRepository ?? new MemoryNoteGroupRepository()
  const hashService = deps.hashService ?? new BunHashService()
  const logService = deps.logService ?? new ConsoleLogService()

  return new Elysia()
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
}
