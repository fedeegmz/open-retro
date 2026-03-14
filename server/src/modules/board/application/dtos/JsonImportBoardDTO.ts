interface ImportedPointDTO {
  x: number
  y: number
}

interface ImportedGroupDTO {
  id: string
  topLeft: ImportedPointDTO
  bottomRight: ImportedPointDTO
  title: string
  description: string
  pinned: boolean
}

interface ImportedNoteDTO {
  id: string
  topLeft: ImportedPointDTO
  bottomRight: ImportedPointDTO
  zIndex: number
  text: string
  createdBy?: string
}

export interface JsonImportBoardDTO {
  board: {
    id: string
    isNotesHidden: boolean
    createdBy: string
    nextZIndex: number
  }
  groups: ImportedGroupDTO[]
  notes: ImportedNoteDTO[]
}
