import type { BoardState, Note, Group, WsMessage } from '../../web-client/src/types/board'

export class Board {
  state: BoardState = {
    notes: [],
    groups: [],
    nextZIndex: 1,
  }

  private passwordHash: string

  constructor(password: string) {
    this.passwordHash = Bun.hash(password).toString()
  }

  checkPassword(password: string): boolean {
    return Bun.hash(password).toString() === this.passwordHash
  }

  handleMessage(msg: WsMessage): void {
    switch (msg.type) {
      case 'note:add':
        this.state.notes.push(msg.note)
        this.state.nextZIndex = Math.max(this.state.nextZIndex, msg.note.zIndex + 1)
        break
      case 'note:move': {
        const note = this.findNote(msg.id)
        if (note) { note.x = msg.x; note.y = msg.y }
        break
      }
      case 'note:resize': {
        const note = this.findNote(msg.id)
        if (note) { note.width = msg.width; note.height = msg.height }
        break
      }
      case 'note:edit': {
        const note = this.findNote(msg.id)
        if (note) note.text = msg.text
        break
      }
      case 'note:delete':
        this.state.notes = this.state.notes.filter(n => n.id !== msg.id)
        break
      case 'note:z': {
        const note = this.findNote(msg.id)
        if (note) {
          note.zIndex = msg.zIndex
          this.state.nextZIndex = Math.max(this.state.nextZIndex, msg.zIndex + 1)
        }
        break
      }
      case 'group:add':
        this.state.groups.push(msg.group)
        break
      case 'group:move': {
        const group = this.findGroup(msg.id)
        if (group) { group.x = msg.x; group.y = msg.y }
        break
      }
      case 'group:resize': {
        const group = this.findGroup(msg.id)
        if (group) { group.width = msg.width; group.height = msg.height }
        break
      }
      case 'group:edit': {
        const group = this.findGroup(msg.id)
        if (group) { group.title = msg.title; group.description = msg.description }
        break
      }
      case 'group:delete':
        this.state.groups = this.state.groups.filter(g => g.id !== msg.id)
        break
      case 'group:pin': {
        const group = this.findGroup(msg.id)
        if (group) group.pinned = msg.pinned
        break
      }
    }
  }

  private findNote(id: string): Note | undefined {
    return this.state.notes.find(n => n.id === id)
  }

  private findGroup(id: string): Group | undefined {
    return this.state.groups.find(g => g.id === id)
  }
}
