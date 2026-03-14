import type { WsMessage, ConnectedUser } from '@shared/types/board'
import { Role } from '@shared/types/role'
import type { ILogService } from '../../shared/domain/services/ILogService'

export class UserSessionManager {
  private readonly clients = new Map<string, Set<any>>()
  private readonly clientInfo = new Map<any, ConnectedUser>()

  constructor(private readonly log: ILogService) {}

  joinRoom(boardId: string, ws: any, user: ConnectedUser): void {
    const roomClients = this.clients.get(boardId) ?? new Set()
    roomClients.add(ws)
    this.clients.set(boardId, roomClients)
    this.clientInfo.set(ws, user)

    this.log.info(`[${boardId}] ${user.username} connected (${roomClients.size} total)`)
  }

  leaveRoom(boardId: string, ws: any): { user: ConnectedUser | undefined; roomEmpty: boolean } {
    const roomClients = this.clients.get(boardId)
    if (!roomClients) return { user: undefined, roomEmpty: true }

    const user = this.clientInfo.get(ws)
    const wasInRoom = roomClients.delete(ws)
    this.clientInfo.delete(ws)

    if (wasInRoom) {
      this.log.info(
        `[${boardId}] ${user?.username ?? 'Client'} disconnected (${roomClients.size} remaining)`,
      )
    }

    const roomEmpty = roomClients.size === 0
    if (roomEmpty) {
      this.clients.delete(boardId)
    }

    return { user: wasInRoom ? user : undefined, roomEmpty }
  }

  computeRole(clientId: string, boardCreatorId: string): Role {
    return clientId === boardCreatorId ? Role.Owner : Role.Contributor
  }

  getUser(ws: any): ConnectedUser | undefined {
    return this.clientInfo.get(ws)
  }

  getRoomUsers(boardId: string): ConnectedUser[] {
    const roomClients = this.clients.get(boardId)
    if (!roomClients) return []

    const users: ConnectedUser[] = []
    for (const raw of roomClients) {
      const info = this.clientInfo.get(raw)
      if (info) users.push(info)
    }
    return users
  }

  getRoomClients(boardId: string): Set<any> | undefined {
    return this.clients.get(boardId)
  }

  broadcastToRoom(boardId: string, message: WsMessage, excludeWs?: any): void {
    const roomClients = this.clients.get(boardId)
    if (!roomClients) return

    const serialized = JSON.stringify(message)
    for (const client of roomClients) {
      if (client !== excludeWs) {
        client.send(serialized)
      }
    }
  }
}
