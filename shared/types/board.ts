export interface ConnectedUser {
  id: string
  username: string
}

export interface Note {
  id: string
  x: number
  y: number
  zIndex: number
  width: number
  height: number
  text: string
  createdBy?: string
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

export enum WsMsgType {
  BoardSync = 'board:sync',
  NoteAdd = 'note:add',
  NoteMove = 'note:move',
  NoteResize = 'note:resize',
  NoteEdit = 'note:edit',
  NoteDelete = 'note:delete',
  NoteZ = 'note:z',
  GroupAdd = 'group:add',
  GroupMove = 'group:move',
  GroupResize = 'group:resize',
  GroupEdit = 'group:edit',
  GroupDelete = 'group:delete',
  GroupPin = 'group:pin',
  UsersSync = 'users:sync',
  UserJoin = 'user:join',
  UserLeave = 'user:leave',
}

export type WsMessage =
  | { type: WsMsgType.BoardSync; state: BoardState }
  | { type: WsMsgType.NoteAdd; note: Note }
  | { type: WsMsgType.NoteMove; id: string; x: number; y: number }
  | { type: WsMsgType.NoteResize; id: string; width: number; height: number }
  | { type: WsMsgType.NoteEdit; id: string; text: string }
  | { type: WsMsgType.NoteDelete; id: string }
  | { type: WsMsgType.NoteZ; id: string; zIndex: number }
  | { type: WsMsgType.GroupAdd; group: Group }
  | { type: WsMsgType.GroupMove; id: string; x: number; y: number }
  | { type: WsMsgType.GroupResize; id: string; width: number; height: number }
  | { type: WsMsgType.GroupEdit; id: string; title: string; description: string }
  | { type: WsMsgType.GroupDelete; id: string }
  | { type: WsMsgType.GroupPin; id: string; pinned: boolean }
  | { type: WsMsgType.UsersSync; users: ConnectedUser[] }
  | { type: WsMsgType.UserJoin; user: ConnectedUser }
  | { type: WsMsgType.UserLeave; userId: string }
