import type { Locale } from '@/lib/i18n'

export type PageProps<T = object> = {
	params: Promise<
		{ locale: Locale } & (T extends { params: infer P } ? P : object)
	>
} & Omit<T, 'params'>
