export class Board {
  readonly id: string
  readonly passwordHash: string
  readonly createdAt: number
  createdBy: string
  isNotesHidden: boolean
  isExpired: boolean
  nextZIndex: number
  voting: { active: boolean; maxVotesPerUser: number }
  timer: { minutes: string; seconds: string; isRunning: boolean }

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
    this.voting = { active: false, maxVotesPerUser: 0 }
    this.timer = { minutes: '00', seconds: '00', isRunning: false }
  }
}
