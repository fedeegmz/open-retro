import { t } from 'elysia'

export const ExportBoardQuerySchema = t.Object({
  format: t.Optional(t.Union([t.Literal('json')])),
})
