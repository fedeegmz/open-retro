export interface Note {
  id: string
  x: number
  y: number
  zIndex: number
  width: number
  height: number
  text: string
}

export interface Group {
  id: string
  x: number
  y: number
  width: number
  height: number
  title: string
  description: string
  pinned: boolean
}

export interface BoardState {
  notes: Note[]
  groups: Group[]
  nextZIndex: number
}

export type WsMessage =
  | { type: 'board:sync'; state: BoardState }
  | { type: 'note:add'; note: Note }
  | { type: 'note:move'; id: string; x: number; y: number }
  | { type: 'note:resize'; id: string; width: number; height: number }
  | { type: 'note:edit'; id: string; text: string }
  | { type: 'note:delete'; id: string }
  | { type: 'note:z'; id: string; zIndex: number }
  | { type: 'group:add'; group: Group }
  | { type: 'group:move'; id: string; x: number; y: number }
  | { type: 'group:resize'; id: string; width: number; height: number }
  | { type: 'group:edit'; id: string; title: string; description: string }
  | { type: 'group:delete'; id: string }
  | { type: 'group:pin'; id: string; pinned: boolean }
