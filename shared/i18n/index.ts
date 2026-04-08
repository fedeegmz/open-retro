import en from './locales/en.json'
import es from './locales/es.json'

export const dictionaries = {
  en,
  es,
} as const

export type Locale = keyof typeof dictionaries
export type Dictionary = typeof en

/**
 * Utility type to get all nested keys of an object in dot notation (e.g., 'common.ok')
 */
export type NestedKeyOf<T extends object> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`
}[keyof T & (string | number)]

export type I18nKeys = NestedKeyOf<Dictionary>

export const defaultLocale: Locale = 'en'
export const supportedLocales: Locale[] = ['en', 'es']

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
]
