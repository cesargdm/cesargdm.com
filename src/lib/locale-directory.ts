import path from 'node:path'

import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'

/**
 * Resolves a content directory for a locale without ever letting the caller's
 * value reach the path. `LOCALES.find` returns the matching entry from the
 * constant list rather than the argument, so a hostile value like `../../etc`
 * can only fall through to the default locale.
 */
export function resolveLocaleDirectory(baseDirectory: string, locale: unknown) {
	const safeLocale: Locale = LOCALES.find((known) => known === locale) ?? 'en'

	return path.join(baseDirectory, safeLocale)
}
