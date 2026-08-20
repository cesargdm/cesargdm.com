import type { APIRoute } from 'astro'

import { ONE_HOUR_SECONDS } from '@/lib/fetch-cache'
import { getRideTotal, getRunTotal } from '@/lib/strava'

export const prerender = false

/**
 * Kept at this path because it is the URL that already exists; the payload is
 * now the year's totals per sport rather than a single run.
 */
export const GET: APIRoute = async () => {
	const [run, ride] = await Promise.all([getRunTotal(), getRideTotal()])

	return new Response(
		JSON.stringify({ run: run ?? null, ride: ride ?? null }),
		{
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': `public, s-maxage=${ONE_HOUR_SECONDS}, stale-while-revalidate`,
			},
		},
	)
}
