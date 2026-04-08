import { Elysia } from 'elysia'
import { I18nService } from './I18nService'

export const i18n = new Elysia({ name: 'i18n' }).derive(
  { as: 'global' },
  ({ headers, query, cookie }) => {
    const locale =
      (query.lang as string) ||
      (cookie.lang?.value as string) ||
      headers['accept-language']?.split(',')[0]
    return {
      i18n: new I18nService(locale),
    }
  },
)
