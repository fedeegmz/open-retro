import type { Group } from '@open-retro/shared/types/board'

export interface INoteGroupRepository {
  findAll(boardId: string): Promise<Group[]>
  findById(boardId: string, groupId: string): Promise<Group>
  save(boardId: string, group: Group): Promise<void>
  delete(boardId: string, groupId: string): Promise<void>
  deleteAll(boardId: string): Promise<void>
}
