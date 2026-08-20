export const LOCALES = ['en', 'es'] as const

export type Locale = (typeof LOCALES)[number]

export function isLocale(value: string | undefined): value is Locale {
	return LOCALES.includes(value as Locale)
}
