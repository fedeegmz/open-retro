import { WsMsgType } from '@open-retro/shared/types/board'
import type { WsMessage } from '@open-retro/shared/types/board'
import type { IBoardRepository } from '../domain/repositories/IBoardRepository'
import type { INoteRepository } from '../domain/repositories/INoteRepository'
import type { INoteGroupRepository } from '../domain/repositories/INoteGroupRepository'

export class BoardMessageHandler {
  constructor(
    private readonly boardRepository: IBoardRepository,
    private readonly noteRepository: INoteRepository,
    private readonly groupRepository: INoteGroupRepository,
  ) {}

  async handle(boardId: string, msg: WsMessage): Promise<void> {
    switch (msg.type) {
      case WsMsgType.NoteAdd: {
        await this.noteRepository.save(boardId, msg.note)
        const board = await this.boardRepository.findById(boardId)
        if (board) board.nextZIndex = Math.max(board.nextZIndex, msg.note.zIndex + 1)
        break
      }
      case WsMsgType.NoteMove: {
        const note = await this.noteRepository.findById(boardId, msg.id)
        if (note) {
          note.x = msg.x
          note.y = msg.y
          await this.noteRepository.save(boardId, note)
        }
        break
      }
      case WsMsgType.NoteResize: {
        const note = await this.noteRepository.findById(boardId, msg.id)
        if (note) {
          note.width = msg.width
          note.height = msg.height
          await this.noteRepository.save(boardId, note)
        }
        break
      }
      case WsMsgType.NoteEdit: {
        const note = await this.noteRepository.findById(boardId, msg.id)
        if (note) {
          note.text = msg.text
          await this.noteRepository.save(boardId, note)
        }
        break
      }
      case WsMsgType.NoteDelete:
        await this.noteRepository.delete(boardId, msg.id)
        break
      case WsMsgType.NoteZ: {
        const note = await this.noteRepository.findById(boardId, msg.id)
        if (note) {
          note.zIndex = msg.zIndex
          await this.noteRepository.save(boardId, note)
          const board = await this.boardRepository.findById(boardId)
          if (board) board.nextZIndex = Math.max(board.nextZIndex, msg.zIndex + 1)
        }
        break
      }
      case WsMsgType.GroupAdd:
        await this.groupRepository.save(boardId, msg.group)
        break
      case WsMsgType.GroupMove: {
        const group = await this.groupRepository.findById(boardId, msg.id)
        if (group) {
          group.x = msg.x
          group.y = msg.y
          await this.groupRepository.save(boardId, group)
        }
        break
      }
      case WsMsgType.GroupResize: {
        const group = await this.groupRepository.findById(boardId, msg.id)
        if (group) {
          group.width = msg.width
          group.height = msg.height
          await this.groupRepository.save(boardId, group)
        }
        break
      }
      case WsMsgType.GroupEdit: {
        const group = await this.groupRepository.findById(boardId, msg.id)
        if (group) {
          group.title = msg.title
          group.description = msg.description
          await this.groupRepository.save(boardId, group)
        }
        break
      }
      case WsMsgType.GroupDelete:
        await this.groupRepository.delete(boardId, msg.id)
        break
      case WsMsgType.GroupPin: {
        const group = await this.groupRepository.findById(boardId, msg.id)
        if (group) {
          group.pinned = msg.pinned
          await this.groupRepository.save(boardId, group)
        }
        break
      }
    }
  }
}
