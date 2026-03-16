import { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import { INoteRepository } from '../../domain/repositories/INoteRepository'
import { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import { JsonExportBoardResultDTO } from '../dtos/JsonExportBoardResultDTO'

export class JsonExportBoardUseCase {
  constructor(
    private boardRepo: IBoardRepository,
    private noteRepo: INoteRepository,
    private groupRepo: INoteGroupRepository,
  ) {}

  async execute(boardId: string): Promise<JsonExportBoardResultDTO> {
    const board = await this.boardRepo.findById(boardId)
    const groups = await this.groupRepo.findAll(boardId)
    const notes = await this.noteRepo.findAll(boardId)

    return {
      board: {
        isNotesHidden: board.isNotesHidden,
        nextZIndex: board.nextZIndex,
      },
      groups: groups.map((group) => ({
        id: group.id,
        topLeft: { x: group.x, y: group.y },
        bottomRight: { x: group.x + group.width, y: group.y + group.height },
        title: group.title,
        description: group.description,
        pinned: group.pinned,
      })),
      notes: notes.map((note) => ({
        id: note.id,
        topLeft: { x: note.x, y: note.y },
        bottomRight: { x: note.x + note.width, y: note.y + note.height },
        zIndex: note.zIndex,
        text: note.text,
        createdBy: note.createdBy,
      })),
    }
  }
}
