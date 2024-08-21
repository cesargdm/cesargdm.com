import type { Locale } from '@/lib/i18n'

export function getAlgoliaIndexName(locale: Locale = 'en') {
	return `cesargdm_${locale}_${process.env.NODE_ENV}` as const
}
