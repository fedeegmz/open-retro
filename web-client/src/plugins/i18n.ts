import { createI18n } from 'vue-i18n'
import { dictionaries, defaultLocale } from '@open-retro/shared/i18n'
import type { Dictionary } from '@open-retro/shared/i18n'

// Support for vue-i18n type safety and autocomplete
declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends Dictionary {}
}

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || defaultLocale,
  fallbackLocale: defaultLocale,
  messages: dictionaries,
})

export default i18n
