import type { Locale } from '@/lib/i18n'

export type PageProps<T = object> = {
	params: {
		locale: Locale
	}
} & T
