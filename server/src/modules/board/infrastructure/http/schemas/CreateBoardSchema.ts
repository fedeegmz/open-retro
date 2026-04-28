import { t } from 'elysia'

export const CreateBoardSchema = t.Object({
  boardId: t.String({ minLength: 1 }),
  password: t.String({ minLength: 1 }),
  clientId: t.String({ minLength: 1 }),
  token: t.Optional(t.String()),
})
