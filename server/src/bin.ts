import { createOpenRetroApp } from './app'
import { ServerConfig } from './modules/shared/domain/ServerConfig'
import { ConsoleLogService } from './modules/shared/infrastructure/services/ConsoleLogService'

function loadConfig(): ServerConfig {
  const port = Number(process.env.PORT) || 3001

  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(';').map((o) => o.trim())
    : '*'

  const sessionLimit = process.env.SESSION_TIME_LIMIT
  const parsedSessionLimit = sessionLimit !== undefined ? parseInt(sessionLimit, 10) : -1
  const sessionTimeLimitSeconds = isNaN(parsedSessionLimit) ? -1 : parsedSessionLimit

  const adminGrace = process.env.ADMIN_GRACE_SECONDS
  const parsedAdminGrace = adminGrace !== undefined ? parseInt(adminGrace, 10) : 60
  const adminGraceSeconds = isNaN(parsedAdminGrace) ? 60 : parsedAdminGrace

  const maxUsers = process.env.MAX_USERS_PER_SESSION
  let maxUsersPerSession: number | null = null
  if (maxUsers !== undefined) {
    const parsedMaxUsers = parseInt(maxUsers, 10)
    maxUsersPerSession = isNaN(parsedMaxUsers) || parsedMaxUsers <= 0 ? null : parsedMaxUsers
  }

  return {
    port,
    corsOrigins,
    sessionTimeLimitSeconds,
    adminGraceSeconds,
    maxUsersPerSession,
  }
}

const config = loadConfig()
const logService = new ConsoleLogService()

const app = createOpenRetroApp({ config, logService })
app.listen(config.port)

logService.info(`Open Retro WS Server running on ws://localhost:${app.server?.port}`)
logService.info(
  `Session time limit: ${config.sessionTimeLimitSeconds > 0 ? config.sessionTimeLimitSeconds + 's' : 'Disabled'}`,
)
logService.info(`Admin grace period: ${config.adminGraceSeconds}s`)
if (config.maxUsersPerSession !== null) {
  logService.info(`Max users per session: ${config.maxUsersPerSession}`)
}
