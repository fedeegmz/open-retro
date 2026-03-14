import { t } from 'elysia'

export const WebSocketQuerySchema = t.Object({
  board: t.String({ minLength: 1 }),
  password: t.String(),
  username: t.String({ minLength: 1 }),
  clientId: t.String({ minLength: 1 }),
})
