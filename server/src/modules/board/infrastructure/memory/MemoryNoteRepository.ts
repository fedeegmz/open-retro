import NotFoundError from '../../../shared/domain/errors/NotFoundError'
import type { INoteRepository } from '../../domain/repositories/INoteRepository'
import type { Note } from '@shared/types/board'

export class MemoryNoteRepository implements INoteRepository {
  private readonly store = new Map<string, Note[]>()

  private getAll(boardId: string): Note[] {
    if (!this.store.has(boardId)) this.store.set(boardId, [])
    return this.store.get(boardId)!
  }

  async findAll(boardId: string): Promise<Note[]> {
    return this.getAll(boardId)
  }

  async findById(boardId: string, noteId: string): Promise<Note> {
    const note = this.getAll(boardId).find((n) => n.id === noteId)
    if (!note) {
      throw new NotFoundError(`Note ${noteId} not found`)
    }
    return note
  }

  async save(boardId: string, note: Note): Promise<void> {
    const notes = this.getAll(boardId)
    const index = notes.findIndex((n) => n.id === note.id)
    if (index >= 0) {
      notes[index] = note
    } else {
      notes.push(note)
    }
  }

  async delete(boardId: string, noteId: string): Promise<void> {
    const notes = this.store.get(boardId)
    if (notes)
      this.store.set(
        boardId,
        notes.filter((n) => n.id !== noteId),
      )
  }

  async deleteAll(boardId: string): Promise<void> {
    this.store.delete(boardId)
  }
}
