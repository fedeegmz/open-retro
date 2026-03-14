export interface IWebSocketClient {
  send(message: string): void
  close(code?: number, reason?: string): void
}
