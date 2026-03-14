import type { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import type { Board } from '../../domain/Board'
import NotFoundError from '../../../shared/domain/errors/NotFoundError'

export class MemoryBoardRepository implements IBoardRepository {
  private readonly store = new Map<string, Board>()

  async findById(id: string): Promise<Board> {
    const board = this.store.get(id)
    if (!board) {
      throw new NotFoundError(`Board ${id} not found`)
    }
    return board
  }

  async save(board: Board): Promise<void> {
    this.store.set(board.id, board)
  }

  async delete(id: string): Promise<void> {
    if (!this.store.has(id)) {
      throw new NotFoundError(`Board ${id} not found`)
    }
    this.store.delete(id)
  }
}
