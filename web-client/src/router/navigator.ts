import type { Router } from 'vue-router'

export class Navigator {
  constructor(private readonly router: Router) {}

  toServerSetup() {
    return this.router.replace('/')
  }

  toBoardSetup() {
    return this.router.push('/connect')
  }

  toBoard(boardId: string) {
    return this.router.push(`/board/${boardId}`)
  }

  backToBoardSetup() {
    return this.router.replace('/connect')
  }
}
