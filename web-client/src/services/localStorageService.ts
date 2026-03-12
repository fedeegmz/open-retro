const KEYS = {
  serverUrl: 'serverUrl',
  boardPassword: 'boardPassword',
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
}
