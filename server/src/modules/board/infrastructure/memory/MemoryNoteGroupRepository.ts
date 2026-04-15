import NotFoundError from '../../../shared/domain/errors/NotFoundError'
import type { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import type { Group } from '@open-retro/shared/types/board'

export class MemoryNoteGroupRepository implements INoteGroupRepository {
  private readonly store = new Map<string, Group[]>()

  private getAll(boardId: string): Group[] {
    if (!this.store.has(boardId)) this.store.set(boardId, [])
    return this.store.get(boardId)!
  }

  async findAll(boardId: string): Promise<Group[]> {
    return this.getAll(boardId)
  }

  async findById(boardId: string, groupId: string): Promise<Group> {
    const group = this.getAll(boardId).find((g) => g.id === groupId)
    if (!group) {
      throw new NotFoundError(`Group ${groupId} not found`)
    }
    return group
  }

  async save(boardId: string, group: Group): Promise<void> {
    const groups = this.getAll(boardId)
    const index = groups.findIndex((g) => g.id === group.id)
    if (index >= 0) {
      groups[index] = group
    } else {
      groups.push(group)
    }
  }

  async delete(boardId: string, groupId: string): Promise<void> {
    const groups = this.store.get(boardId)
    if (groups)
      this.store.set(
        boardId,
        groups.filter((g) => g.id !== groupId),
      )
  }

  async deleteAll(boardId: string): Promise<void> {
    this.store.delete(boardId)
  }
}
