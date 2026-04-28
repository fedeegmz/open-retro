export interface ServerConfig {
  port: number
  corsOrigins: string | string[]
  sessionTimeLimitSeconds: number
  adminGraceSeconds: number
  maxUsersPerSession: number | null
  showApiDocs: boolean
  requireAuthForCreation?: boolean
}
