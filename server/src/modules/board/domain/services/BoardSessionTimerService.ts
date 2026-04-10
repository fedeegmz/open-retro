import type { ServerConfig } from '../../../shared/domain/ServerConfig'

export class BoardSessionTimerService {
  private readonly limitSeconds: number
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>()

  constructor(config: ServerConfig) {
    this.limitSeconds = config.sessionTimeLimitSeconds
  }

  isEnabled(): boolean {
    return this.limitSeconds > 0
  }

  start(boardId: string, onExpire: () => void): void {
    if (!this.isEnabled()) return

    const timer = setTimeout(onExpire, this.limitSeconds * 1000)
    this.timers.set(boardId, timer)
  }

  cancel(boardId: string): void {
    const timer = this.timers.get(boardId)
    if (timer !== undefined) {
      clearTimeout(timer)
      this.timers.delete(boardId)
    }
  }
}
