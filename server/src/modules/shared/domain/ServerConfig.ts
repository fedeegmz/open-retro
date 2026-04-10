export class ServerConfig {
  readonly port: number
  readonly corsOrigins: string | string[]
  readonly sessionTimeLimitSeconds: number
  readonly adminGraceSeconds: number

  constructor() {
    this.port = Number(process.env.PORT) || 3001

    this.corsOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(';').map((o) => o.trim())
      : '*'

    const sessionLimit = process.env.SESSION_TIME_LIMIT
    const parsedSessionLimit = sessionLimit !== undefined ? parseInt(sessionLimit, 10) : -1
    this.sessionTimeLimitSeconds = isNaN(parsedSessionLimit) ? -1 : parsedSessionLimit

    const adminGrace = process.env.ADMIN_GRACE_SECONDS
    const parsedAdminGrace = adminGrace !== undefined ? parseInt(adminGrace, 10) : 60
    this.adminGraceSeconds = isNaN(parsedAdminGrace) ? 60 : parsedAdminGrace
  }
}
