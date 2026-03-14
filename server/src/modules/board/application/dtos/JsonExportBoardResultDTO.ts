interface ExportedPointDTO {
  x: number
  y: number
}

interface ExportedGroupDTO {
  id: string
  topLeft: ExportedPointDTO
  bottomRight: ExportedPointDTO
  title: string
  description: string
  pinned: boolean
}

interface ExportedNoteDTO {
  id: string
  topLeft: ExportedPointDTO
  bottomRight: ExportedPointDTO
  zIndex: number
  text: string
  createdBy?: string
}

export interface JsonExportBoardResultDTO {
  board: {
    id: string
    isNotesHidden: boolean
    createdBy: string
    nextZIndex: number
  }
  groups: ExportedGroupDTO[]
  notes: ExportedNoteDTO[]
}
