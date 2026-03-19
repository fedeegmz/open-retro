export class Config {
  readonly defaultServerUrl: string | null

  constructor() {
    this.defaultServerUrl = import.meta.env.VITE_DEFAULT_SERVER_URL ?? null
  }
}

let _instance: Config | null = null

export function initConfig(): void {
  if (_instance === null) {
    _instance = new Config()
  }
}

export function getConfig(): Config {
  if (_instance === null) {
    initConfig()
  }
  return _instance!
}
