# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a monorepo with two packages:

- `server/` — Bun WebSocket server
- `web-client/` — Vue 3 + Vite frontend

There is no root-level package.json or workspace manager. Each package is developed independently.

## Commands

### Server (`server/`)

```bash
bun run dev    # run with --watch (hot reload)
bun run start  # run without watch
```

### Web Client (`web-client/`)

```bash
npm run dev          # Vite dev server
npm run build        # type-check + build
npm run type-check   # vue-tsc only
npm run lint         # oxlint + eslint (with --fix)
npm run format       # oxfmt on src/
```

## Architecture

### Shared Types

`web-client/src/types/board.ts` is the single source of truth for all shared data types. The server imports directly from this file via relative path (`../../web-client/src/types/board`). Any change to `WsMessage`, `Note`, `Group`, or `BoardState` affects both sides.

### WebSocket Protocol

The server (`server/src/server.ts`) acts as a relay with state:
- `POST /board` — creates a new board with a password (hashed via `Bun.hash`)
- `GET /board/exists/:id` — checks if a board exists
- `GET /ping` — health check
- WebSocket upgrade: `ws://<host>?board=<id>&password=<pass>`

On WS connect, the server sends `board:sync` with the full current state. All subsequent messages are forwarded to other clients in the same room and applied to the server's in-memory `Board` state. Boards are deleted from memory when the last client disconnects.

### Client Flow

1. `ServerSetup` view (`/`) — user enters WS server URL, validated via `/ping`. Stored via `LocalStorageService`.
2. `BoardSetup` view (`/connect`) — user creates or joins a board with a password. Stored via `LocalStorageService`.
3. `BoardView` view (`/board/:id`) — loads `Board.vue` with server URL, board ID, and password from `LocalStorageService`.

### Client State Management

There is no Pinia/Vuex. State lives in `Board.vue` as `ref<Note[]>` and `ref<Group[]>`. Persistence is handled by `LocalStorageService` (`src/services/localStorageService.ts`), which manages `serverUrl` and `boardPassword` keys in `localStorage`. The `useWebSocket` composable (`src/composables/useWebSocket.ts`) manages the WebSocket connection with auto-reconnect (2s delay) and exposes `send`, `onMessage`, `isConnected`, and `wsError`. Auth failures (close code `4001`) disable reconnect.

### Linting

The client uses a two-pass lint setup: oxlint runs first (faster, covers correctness rules), then ESLint handles rules oxlint doesn't cover. The `eslint-plugin-oxlint` is used to disable ESLint rules already handled by oxlint.
