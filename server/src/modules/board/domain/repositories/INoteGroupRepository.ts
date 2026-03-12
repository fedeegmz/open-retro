import type { Group } from '@shared/types/board'

export interface INoteGroupRepository {
  findAll(boardId: string): Group[]
  findById(boardId: string, groupId: string): Group | undefined
  save(boardId: string, group: Group): void
  delete(boardId: string, groupId: string): void
  deleteAll(boardId: string): void
}
