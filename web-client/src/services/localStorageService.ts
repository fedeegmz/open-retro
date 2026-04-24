import { newUUID } from '@/utils/stringUtils'

const KEYS = {
  boardPassword: 'boardPassword',
  username: 'username',
  clientId: 'clientId',
  lang: 'lang',
} as const

export const LocalStorageService = {
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

  getLanguage(): string | null {
    return localStorage.getItem(KEYS.lang)
  },
  setLanguage(code: string): void {
    localStorage.setItem(KEYS.lang, code)
  },
}
