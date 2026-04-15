import { dictionaries, Locale, defaultLocale, I18nKeys } from '@open-retro/shared/i18n'

export class I18nService {
  private locale: Locale

  constructor(locale?: string) {
    this.locale = (locale as Locale) in dictionaries ? (locale as Locale) : defaultLocale
  }

  t(path: I18nKeys): string {
    const keys = (path as string).split('.')
    let current: any = dictionaries[this.locale]

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return path
      }
    }

    return typeof current === 'string' ? current : path
  }

  getLocale(): Locale {
    return this.locale
  }
}
