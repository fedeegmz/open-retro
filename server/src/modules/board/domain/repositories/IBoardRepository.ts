import type { Board } from '../Board'

export interface IBoardRepository {
  findById(id: string): Promise<Board>
  save(board: Board): Promise<void>
  delete(id: string): Promise<void>
}
