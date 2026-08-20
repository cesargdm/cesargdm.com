import type { APIRoute } from 'astro'

import { ONE_DAY_SECONDS } from '@/lib/fetch-cache'
import { getTimeZone } from '@/lib/slack'

export const prerender = false

export const GET: APIRoute = async () => {
	// Never 500s: an unset token or a revoked one falls back to the default zone,
	// same as the footer does.
	return new Response(JSON.stringify({ tz: await getTimeZone() }), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': `public, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate`,
		},
	})
}
