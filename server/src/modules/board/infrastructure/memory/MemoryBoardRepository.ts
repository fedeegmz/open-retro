import type { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import type { Board } from '../../domain/Board'

export class MemoryBoardRepository implements IBoardRepository {
  private readonly store = new Map<string, Board>()

  findById(id: string): Board | undefined {
    return this.store.get(id)
  }

  save(board: Board): void {
    this.store.set(board.id, board)
  }

  exists(id: string): boolean {
    return this.store.has(id)
  }

  delete(id: string): void {
    this.store.delete(id)
  }
}
