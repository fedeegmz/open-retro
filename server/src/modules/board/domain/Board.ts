export class Board {
  readonly id: string
  readonly passwordHash: string
  nextZIndex: number

  constructor(id: string, passwordHash: string, nextZIndex = 1) {
    this.id = id
    this.passwordHash = passwordHash
    this.nextZIndex = nextZIndex
  }
}
