import type { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import type { Group } from '@shared/types/board'

export class MemoryNoteGroupRepository implements INoteGroupRepository {
  private readonly store = new Map<string, Group[]>()

  private getAll(boardId: string): Group[] {
    if (!this.store.has(boardId)) this.store.set(boardId, [])
    return this.store.get(boardId)!
  }

  findAll(boardId: string): Group[] {
    return this.getAll(boardId)
  }

  findById(boardId: string, groupId: string): Group | undefined {
    return this.getAll(boardId).find(g => g.id === groupId)
  }

  save(boardId: string, group: Group): void {
    const groups = this.getAll(boardId)
    const index = groups.findIndex(g => g.id === group.id)
    if (index >= 0) {
      groups[index] = group
    } else {
      groups.push(group)
    }
  }

  delete(boardId: string, groupId: string): void {
    const groups = this.store.get(boardId)
    if (groups) this.store.set(boardId, groups.filter(g => g.id !== groupId))
  }

  deleteAll(boardId: string): void {
    this.store.delete(boardId)
  }
}
