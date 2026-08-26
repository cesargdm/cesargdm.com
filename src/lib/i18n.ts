export const LOCALES = ['en', 'es'] as const

export type Locale = (typeof LOCALES)[number]

export function isLocale(value: string | undefined): value is Locale {
	return LOCALES.includes(value as Locale)
}

/**
 * Prefix a path with a locale. `pathname === '/'` must become `/en`, not `/en/`:
 * the site emits `en.html` (`trailingSlash: 'never'`), so a redirect to `/en/`
 * costs a second 307 hop before the document loads.
 */
export function withLocalePrefix(
	locale: Locale,
	pathname: string,
	search = '',
): string {
	const path = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`

	return `${path}${search}`
}
