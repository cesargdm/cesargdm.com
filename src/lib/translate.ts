import { setupI18n } from '@lingui/core'

import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'
import type { MessageId } from '@/lib/message-ids'

// Relative, not the `@/` alias: the alias resolves .po imports past the Lingui
// plugin's `.po` id filter, and the named export silently comes back undefined
// instead of failing — every message then renders as its own id.
import { messages as en } from '../locales/en.po'
import { messages as es } from '../locales/es.po'

const CATALOGS = { en, es }

/*
 * One I18n instance per locale rather than a single instance switched with
 * `activate()`. Astro renders both locales in the same process during a build,
 * and an island can mount in either locale on the client, so a shared "active
 * locale" is a race rather than a convenience.
 */
const INSTANCES = Object.fromEntries(
	LOCALES.map((locale) => [
		locale,
		setupI18n({ locale, messages: { [locale]: CATALOGS[locale] } }),
	]),
) as Record<Locale, ReturnType<typeof setupI18n>>

export type Translate = (
	id: MessageId,
	values?: Record<string, unknown>,
) => string

/** Returns the translate function bound to one locale. */
export function getTranslate(locale: Locale): Translate {
	const i18n = INSTANCES[locale]

	return (id, values) => i18n._(id, values)
}
