import type { Locale } from '@/lib/i18n'

const CHEERS: Record<Locale, string[]> = {
	en: ['again', 'buddy', 'friend', 'stalker', 'mom', 'debugger'],
	es: ['de nuevo', 'compa', 'amigo', 'acosador', 'mamá', 'debugger'],
}

const VISIT_THRESHOLDS = [2, 10, 20, 30, 50]

export function getCheerFromVisitsCount(visitsCount: string, locale: Locale) {
	const visits = Number(visitsCount)
	const index = VISIT_THRESHOLDS.findIndex((max) => visits <= max)

	return CHEERS[locale][index === -1 ? VISIT_THRESHOLDS.length : index]
}
