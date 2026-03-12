import type { Board } from '../Board'

export interface IBoardRepository {
  findById(id: string): Board | undefined
  save(board: Board): void
  exists(id: string): boolean
  delete(id: string): void
}
