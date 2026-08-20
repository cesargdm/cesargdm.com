import type { APIRoute } from 'astro'

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
			'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
		},
	})
}
