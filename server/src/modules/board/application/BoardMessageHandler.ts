import { WsMsgType } from '@shared/types/board'
import type { WsMessage } from '@shared/types/board'
import type { IBoardRepository } from '../domain/repositories/IBoardRepository'
import type { INoteRepository } from '../domain/repositories/INoteRepository'
import type { INoteGroupRepository } from '../domain/repositories/INoteGroupRepository'

export class BoardMessageHandler {
  constructor(
    private readonly boards: IBoardRepository,
    private readonly notes: INoteRepository,
    private readonly groups: INoteGroupRepository,
  ) {}

  handle(boardId: string, msg: WsMessage): void {
    switch (msg.type) {
      case WsMsgType.NoteAdd: {
        this.notes.save(boardId, msg.note)
        const board = this.boards.findById(boardId)
        if (board) board.nextZIndex = Math.max(board.nextZIndex, msg.note.zIndex + 1)
        break
      }
      case WsMsgType.NoteMove: {
        const note = this.notes.findById(boardId, msg.id)
        if (note) { note.x = msg.x; note.y = msg.y; this.notes.save(boardId, note) }
        break
      }
      case WsMsgType.NoteResize: {
        const note = this.notes.findById(boardId, msg.id)
        if (note) { note.width = msg.width; note.height = msg.height; this.notes.save(boardId, note) }
        break
      }
      case WsMsgType.NoteEdit: {
        const note = this.notes.findById(boardId, msg.id)
        if (note) { note.text = msg.text; this.notes.save(boardId, note) }
        break
      }
      case WsMsgType.NoteDelete:
        this.notes.delete(boardId, msg.id)
        break
      case WsMsgType.NoteZ: {
        const note = this.notes.findById(boardId, msg.id)
        if (note) {
          note.zIndex = msg.zIndex
          this.notes.save(boardId, note)
          const board = this.boards.findById(boardId)
          if (board) board.nextZIndex = Math.max(board.nextZIndex, msg.zIndex + 1)
        }
        break
      }
      case WsMsgType.GroupAdd:
        this.groups.save(boardId, msg.group)
        break
      case WsMsgType.GroupMove: {
        const group = this.groups.findById(boardId, msg.id)
        if (group) { group.x = msg.x; group.y = msg.y; this.groups.save(boardId, group) }
        break
      }
      case WsMsgType.GroupResize: {
        const group = this.groups.findById(boardId, msg.id)
        if (group) { group.width = msg.width; group.height = msg.height; this.groups.save(boardId, group) }
        break
      }
      case WsMsgType.GroupEdit: {
        const group = this.groups.findById(boardId, msg.id)
        if (group) { group.title = msg.title; group.description = msg.description; this.groups.save(boardId, group) }
        break
      }
      case WsMsgType.GroupDelete:
        this.groups.delete(boardId, msg.id)
        break
      case WsMsgType.GroupPin: {
        const group = this.groups.findById(boardId, msg.id)
        if (group) { group.pinned = msg.pinned; this.groups.save(boardId, group) }
        break
      }
    }
  }
}
