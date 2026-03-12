import type { Note } from '@shared/types/board'

export interface INoteRepository {
  findAll(boardId: string): Note[]
  findById(boardId: string, noteId: string): Note | undefined
  save(boardId: string, note: Note): void
  delete(boardId: string, noteId: string): void
  deleteAll(boardId: string): void
}
