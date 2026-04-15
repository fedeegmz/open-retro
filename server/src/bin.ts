import { createOpenRetroApp } from './app'
import { ServerConfig } from './modules/shared/domain/ServerConfig'
import { ConsoleLogService } from './modules/shared/infrastructure/services/ConsoleLogService'

const config = new ServerConfig()
const logService = new ConsoleLogService()

const app = createOpenRetroApp({ config, logService })
app.listen(config.port)

logService.info(`Open Retro WS Server running on ws://localhost:${app.server?.port}`)
logService.info(
  `Session time limit: ${config.sessionTimeLimitSeconds > 0 ? config.sessionTimeLimitSeconds + 's' : 'Disabled'}`,
)
logService.info(`Admin grace period: ${config.adminGraceSeconds}s`)
