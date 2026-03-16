import { IBoardRepository } from '../../domain/repositories/IBoardRepository'
import { INoteRepository } from '../../domain/repositories/INoteRepository'
import { INoteGroupRepository } from '../../domain/repositories/INoteGroupRepository'
import { IHashService } from '../../../shared/domain/services/IHashService'
import { JsonImportBoardDTO } from '../dtos/JsonImportBoardDTO'
import { Board } from '../../domain/Board'
import NotFoundError from '../../../shared/domain/errors/NotFoundError'
import InvalidArgError from '../../../shared/domain/errors/InvalidArgError'

export class JsonImportBoardUseCase {
  constructor(
    private boardRepo: IBoardRepository,
    private noteRepo: INoteRepository,
    private groupRepo: INoteGroupRepository,
    private hashService: IHashService,
  ) {}

  async execute(
    boardId: string,
    passwordPlain: string,
    clientId: string,
    data: JsonImportBoardDTO,
  ): Promise<void> {
    let board: Board

    try {
      board = await this.boardRepo.findById(boardId)
      if (!this.hashService.verify(passwordPlain, board.passwordHash)) {
        throw new InvalidArgError('Invalid password')
      }

      // Clear existing items since we are importing over an existing board
      await this.noteRepo.deleteAll(boardId)
      await this.groupRepo.deleteAll(boardId)
    } catch (e) {
      if (e instanceof NotFoundError) {
        board = new Board(boardId, this.hashService.hash(passwordPlain), clientId)
      } else {
        throw e
      }
    }

    board.createdBy = clientId
    board.isNotesHidden = data.board.isNotesHidden
    board.nextZIndex = data.board.nextZIndex

    await this.boardRepo.save(board)

    for (const groupDto of data.groups) {
      await this.groupRepo.save(boardId, {
        id: groupDto.id,
        x: groupDto.topLeft.x,
        y: groupDto.topLeft.y,
        width: groupDto.bottomRight.x - groupDto.topLeft.x,
        height: groupDto.bottomRight.y - groupDto.topLeft.y,
        title: groupDto.title,
        description: groupDto.description,
        pinned: groupDto.pinned,
      })
    }

    for (const noteDto of data.notes) {
      await this.noteRepo.save(boardId, {
        id: noteDto.id,
        x: noteDto.topLeft.x,
        y: noteDto.topLeft.y,
        zIndex: noteDto.zIndex,
        width: noteDto.bottomRight.x - noteDto.topLeft.x,
        height: noteDto.bottomRight.y - noteDto.topLeft.y,
        text: noteDto.text,
        createdBy: noteDto.createdBy,
      })
    }
  }
}
