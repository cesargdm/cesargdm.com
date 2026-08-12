import type { Locale } from '@/lib/i18n'

export function getAlgoliaIndexName(locale: Locale = 'en') {
	return `cesargdm_${locale}_${import.meta.env.MODE}` as const
}
