import type { INoteRepository } from '../../domain/repositories/INoteRepository'
import type { Note } from '@shared/types/board'

export class MemoryNoteRepository implements INoteRepository {
  private readonly store = new Map<string, Note[]>()

  private getAll(boardId: string): Note[] {
    if (!this.store.has(boardId)) this.store.set(boardId, [])
    return this.store.get(boardId)!
  }

  findAll(boardId: string): Note[] {
    return this.getAll(boardId)
  }

  findById(boardId: string, noteId: string): Note | undefined {
    return this.getAll(boardId).find(n => n.id === noteId)
  }

  save(boardId: string, note: Note): void {
    const notes = this.getAll(boardId)
    const index = notes.findIndex(n => n.id === note.id)
    if (index >= 0) {
      notes[index] = note
    } else {
      notes.push(note)
    }
  }

  delete(boardId: string, noteId: string): void {
    const notes = this.store.get(boardId)
    if (notes) this.store.set(boardId, notes.filter(n => n.id !== noteId))
  }

  deleteAll(boardId: string): void {
    this.store.delete(boardId)
  }
}
