import { Role } from './role'
export interface ConnectedUser {
  id: string
  username: string
  role: Role
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
  votedBy?: string[]
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
  isNotesHidden: boolean
  createdBy: string
  voting: {
    active: boolean
    maxVotesPerUser: number
  }
}
export declare enum WsMsgType {
  BoardSync = 'board:sync',
  BoardToggleNotes = 'board:toggle_notes',
  BoardNotesVisibility = 'board:notes_visibility',
  BoardVotingStart = 'board:voting_start',
  BoardVotingPause = 'board:voting_pause',
  BoardVotingReset = 'board:voting_reset',
  NoteAdd = 'note:add',
  NoteMove = 'note:move',
  NoteResize = 'note:resize',
  NoteEdit = 'note:edit',
  NoteDelete = 'note:delete',
  NoteZ = 'note:z',
  NoteVote = 'note:vote',
  NoteUnvote = 'note:unvote',
  GroupAdd = 'group:add',
  GroupMove = 'group:move',
  GroupResize = 'group:resize',
  GroupEdit = 'group:edit',
  GroupDelete = 'group:delete',
  GroupPin = 'group:pin',
  UsersSync = 'users:sync',
  UserJoin = 'user:join',
  UserLeave = 'user:leave',
  SessionExpired = 'session:expired',
}
export type WsMessage =
  | {
      type: WsMsgType.BoardSync
      state: BoardState
    }
  | {
      type: WsMsgType.BoardToggleNotes
      isHidden: boolean
    }
  | {
      type: WsMsgType.BoardNotesVisibility
      isHidden: boolean
    }
  | {
      type: WsMsgType.BoardVotingStart
      maxVotesPerUser: number
    }
  | {
      type: WsMsgType.BoardVotingPause
    }
  | {
      type: WsMsgType.BoardVotingReset
    }
  | {
      type: WsMsgType.NoteAdd
      note: Note
    }
  | {
      type: WsMsgType.NoteMove
      id: string
      x: number
      y: number
    }
  | {
      type: WsMsgType.NoteResize
      id: string
      width: number
      height: number
    }
  | {
      type: WsMsgType.NoteEdit
      id: string
      text: string
    }
  | {
      type: WsMsgType.NoteDelete
      id: string
    }
  | {
      type: WsMsgType.NoteZ
      id: string
      zIndex: number
    }
  | {
      type: WsMsgType.NoteVote
      id: string
      userId?: string
    }
  | {
      type: WsMsgType.NoteUnvote
      id: string
      userId?: string
    }
  | {
      type: WsMsgType.GroupAdd
      group: Group
    }
  | {
      type: WsMsgType.GroupMove
      id: string
      x: number
      y: number
    }
  | {
      type: WsMsgType.GroupResize
      id: string
      width: number
      height: number
    }
  | {
      type: WsMsgType.GroupEdit
      id: string
      title: string
      description: string
    }
  | {
      type: WsMsgType.GroupDelete
      id: string
    }
  | {
      type: WsMsgType.GroupPin
      id: string
      pinned: boolean
    }
  | {
      type: WsMsgType.UsersSync
      users: ConnectedUser[]
    }
  | {
      type: WsMsgType.UserJoin
      user: ConnectedUser
    }
  | {
      type: WsMsgType.UserLeave
      userId: string
    }
  | {
      type: WsMsgType.SessionExpired
    }
