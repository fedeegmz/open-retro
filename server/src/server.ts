import type { ServerWebSocket } from 'bun'
import { Board } from './board'
import type { WsMessage } from '../../web-client/src/types/board'

interface WsData {
  boardId: string
}

const boards = new Map<string, { board: Board; clients: Set<ServerWebSocket<WsData>> }>()

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

const server = Bun.serve<WsData>({
  port: 3001,
  async fetch(req, server) {
    const url = new URL(req.url)

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    // GET /ping - health check para que el cliente valide la URL del servidor
    if (req.method === 'GET' && url.pathname === '/ping') {
      return jsonResponse({ ok: true })
    }

    // POST /board - crea un nuevo board con contraseña
    if (req.method === 'POST' && url.pathname === '/board') {
      const body = await req.json() as { boardId: string; password: string }
      const { boardId, password } = body

      if (!boardId || !password) {
        return jsonResponse({ error: 'boardId y password son requeridos' }, 400)
      }

      if (boards.has(boardId)) {
        return jsonResponse({ error: 'Ya existe un board con ese ID' }, 409)
      }

      boards.set(boardId, { board: new Board(password), clients: new Set() })
      console.log(`[${boardId}] Board creado`)
      return jsonResponse({ ok: true, boardId })
    }

    // GET /board/:id - verifica si un board existe (para poder unirse)
    const boardMatch = url.pathname.match(/^\/board\/(.+)$/)
    if (req.method === 'GET' && boardMatch) {
      const boardId = boardMatch[1]
      if (!boards.has(boardId)) {
        return jsonResponse({ error: 'Board no encontrado' }, 404)
      }
      return jsonResponse({ ok: true, boardId })
    }

    // Upgrade a WebSocket con validación de contraseña
    const boardId = url.searchParams.get('board') || ''
    const password = url.searchParams.get('password') || ''

    if (!boardId) {
      return new Response('Board ID requerido', { status: 400, headers: corsHeaders })
    }

    const room = boards.get(boardId)
    if (!room) {
      return new Response('Board no encontrado', { status: 404, headers: corsHeaders })
    }

    if (!room.board.checkPassword(password)) {
      return new Response('Contraseña incorrecta', { status: 401, headers: corsHeaders })
    }

    if (server.upgrade(req, { data: { boardId } })) {
      return undefined
    }

    return new Response('Open Retro WS Server', { status: 200, headers: corsHeaders })
  },
  websocket: {
    open(ws) {
      const room = boards.get(ws.data.boardId)
      if (!room) { ws.close(4004, 'Board no encontrado'); return }

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
