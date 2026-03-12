export interface ILogService {
  info(message: string): void
  warn(message: string): void
  error(message: string): void
}
