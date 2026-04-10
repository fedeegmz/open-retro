export class Board {
  readonly id: string
  readonly passwordHash: string
  readonly createdAt: number
  createdBy: string
  isNotesHidden: boolean
  isExpired: boolean
  nextZIndex: number

  constructor(
    id: string,
    passwordHash: string,
    createdBy: string,
    isNotesHidden = false,
    nextZIndex = 1,
    createdAt = Date.now(),
    isExpired = false,
  ) {
    this.id = id
    this.passwordHash = passwordHash
    this.createdAt = createdAt
    this.createdBy = createdBy
    this.isNotesHidden = isNotesHidden
    this.isExpired = isExpired
    this.nextZIndex = nextZIndex
  }
}
