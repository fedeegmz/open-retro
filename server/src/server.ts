import type { ServerWebSocket } from 'bun'
import { Board } from './board'
import type { WsMessage } from '../../web-client/src/types/board'

interface WsData {
  boardId: string
}

const boards = new Map<string, { board: Board; clients: Set<ServerWebSocket<WsData>> }>()

function getOrCreateRoom(boardId: string) {
  if (!boards.has(boardId)) {
    boards.set(boardId, { board: new Board(), clients: new Set() })
  }
  return boards.get(boardId)!
}

const server = Bun.serve<WsData>({
  port: 3001,
  fetch(req, server) {
    const url = new URL(req.url)
    const boardId = url.searchParams.get('board') || 'default'

    if (server.upgrade(req, { data: { boardId } })) {
      return undefined
    }

    return new Response('Open Retro WS Server', { status: 200 })
  },
  websocket: {
    open(ws) {
      const room = getOrCreateRoom(ws.data.boardId)
      room.clients.add(ws)

      const syncMsg: WsMessage = {
        type: 'board:sync',
        state: room.board.state,
      }
      ws.send(JSON.stringify(syncMsg))

      console.log(`[${ws.data.boardId}] Client connected (${room.clients.size} total)`)
    },
    message(ws, message) {
      const room = boards.get(ws.data.boardId)
      if (!room) return

      const msg = JSON.parse(message as string) as WsMessage
      room.board.handleMessage(msg)

      const raw = JSON.stringify(msg)
      for (const client of room.clients) {
        if (client !== ws) {
          client.send(raw)
        }
      }
    },
    close(ws) {
      const room = boards.get(ws.data.boardId)
      if (!room) return

      room.clients.delete(ws)
      console.log(`[${ws.data.boardId}] Client disconnected (${room.clients.size} remaining)`)

      if (room.clients.size === 0) {
        boards.delete(ws.data.boardId)
        console.log(`[${ws.data.boardId}] Room cleaned up`)
      }
    },
  },
})

console.log(`Open Retro WS Server running on ws://localhost:${server.port}`)
