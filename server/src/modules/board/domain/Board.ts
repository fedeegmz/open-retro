export class Board {
  readonly id: string
  readonly passwordHash: string
  createdBy: string
  isNotesHidden: boolean
  nextZIndex: number

  constructor(
    id: string,
    passwordHash: string,
    createdBy: string,
    isNotesHidden = false,
    nextZIndex = 1,
  ) {
    this.id = id
    this.passwordHash = passwordHash
    this.createdBy = createdBy
    this.isNotesHidden = isNotesHidden
    this.nextZIndex = nextZIndex
  }
}
