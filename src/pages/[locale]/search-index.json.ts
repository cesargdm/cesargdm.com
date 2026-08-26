import type { APIRoute } from 'astro'

import {
	cacheControl,
	ONE_DAY_SECONDS,
	ONE_HOUR_SECONDS,
} from '@/lib/fetch-cache'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'
import { buildSearchIndex } from '@/lib/search-index'

export const prerender = true

export function getStaticPaths() {
	return LOCALES.map((locale) => ({ params: { locale } }))
}

export const GET: APIRoute = ({ params }) => {
	const index = buildSearchIndex(params.locale as Locale)

	return new Response(JSON.stringify(index), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': cacheControl(ONE_DAY_SECONDS, ONE_HOUR_SECONDS),
		},
	})
}
