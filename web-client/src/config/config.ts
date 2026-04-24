export interface Config {
  defaultServerUrl: string
}

let _instance: Config | null = null

export function initConfig(config: Config): void {
  _instance = config
}

export function getConfig(): Config {
  if (_instance === null) {
    throw new Error('Config has not been initialized. Call initConfig() first.')
  }
  return _instance
}
