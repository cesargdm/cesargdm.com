import type { APIRoute } from 'astro'

import { ONE_HOUR_SECONDS } from '@/lib/fetch-cache'
import { getLastRun } from '@/lib/strava'

export const prerender = false

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify((await getLastRun()) ?? null), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': `public, s-maxage=${ONE_HOUR_SECONDS}, stale-while-revalidate`,
		},
	})
}
