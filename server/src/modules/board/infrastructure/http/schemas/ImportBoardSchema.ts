import { t } from 'elysia'

export const ImportBoardSchema = t.Object({
  boardId: t.String({ minLength: 1 }),
  password: t.String({ minLength: 1 }),
  clientId: t.String({ minLength: 1 }),
  token: t.Optional(t.String()),
  data: t.Object({
    board: t.Object({
      isNotesHidden: t.Boolean(),
      nextZIndex: t.Number(),
    }),
    groups: t.Array(
      t.Object({
        id: t.String(),
        topLeft: t.Object({ x: t.Number(), y: t.Number() }),
        bottomRight: t.Object({ x: t.Number(), y: t.Number() }),
        title: t.String(),
        description: t.String(),
        pinned: t.Boolean(),
      }),
    ),
    notes: t.Array(
      t.Object({
        id: t.String(),
        topLeft: t.Object({ x: t.Number(), y: t.Number() }),
        bottomRight: t.Object({ x: t.Number(), y: t.Number() }),
        zIndex: t.Number(),
        text: t.String(),
        createdBy: t.Optional(t.String()),
      }),
    ),
  }),
})
