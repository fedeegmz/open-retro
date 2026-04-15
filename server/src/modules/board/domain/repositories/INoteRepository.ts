import type { Note } from '@open-retro/shared/types/board'

export interface INoteRepository {
  findAll(boardId: string): Promise<Note[]>
  findById(boardId: string, noteId: string): Promise<Note>
  save(boardId: string, note: Note): Promise<void>
  delete(boardId: string, noteId: string): Promise<void>
  deleteAll(boardId: string): Promise<void>
}
