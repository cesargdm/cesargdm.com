export const LOCALES = ['en', 'es'] as const

export type Locale = (typeof LOCALES)[number]
