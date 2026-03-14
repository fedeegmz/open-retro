import { newUUID } from '@/utils/stringUtils'

const KEYS = {
  serverUrl: 'serverUrl',
  boardPassword: 'boardPassword',
  username: 'username',
  clientId: 'clientId',
} as const

export const LocalStorageService = {
  getServerUrl(): string | null {
    return localStorage.getItem(KEYS.serverUrl)
  },
  setServerUrl(url: string): void {
    localStorage.setItem(KEYS.serverUrl, url)
  },

  getBoardPassword(): string | null {
    return localStorage.getItem(KEYS.boardPassword)
  },
  setBoardPassword(password: string): void {
    localStorage.setItem(KEYS.boardPassword, password)
  },

  getUsername(): string | null {
    return localStorage.getItem(KEYS.username)
  },
  setUsername(name: string): void {
    localStorage.setItem(KEYS.username, name)
  },

  getClientId(): string {
    let id = localStorage.getItem(KEYS.clientId)
    if (!id) {
      id = newUUID()
      localStorage.setItem(KEYS.clientId, id)
    }
    return id
  },
}
