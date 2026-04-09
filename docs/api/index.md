# Referencia API

## Endpoints HTTP

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/board` | Crea un nuevo board |
| `POST` | `/board/join` | Verifica contraseña de un board |
| `GET` | `/board/exists/:id` | Verifica si un board existe |
| `GET` | `/board/:id/export` | Exporta el board en JSON |
| `POST` | `/board/import` | Importa un board desde JSON |
| `GET` | `/ping` | Health check |

## WebSocket

**URL:** `ws://<host>/board/ws?board=<id>&password=<pass>&username=<name>&clientId=<id>`

Al conectarse, el servidor envía un mensaje `board:sync` con el estado completo del board.
