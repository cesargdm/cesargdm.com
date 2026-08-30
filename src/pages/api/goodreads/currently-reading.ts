import type { APIRoute } from 'astro'

import { cacheControl, ONE_DAY_SECONDS } from '@/lib/fetch-cache'
import { getCurrentlyReading } from '@/lib/goodreads'

export const prerender = false

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify(await getCurrentlyReading()), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': cacheControl(ONE_DAY_SECONDS),
		},
	})
}
