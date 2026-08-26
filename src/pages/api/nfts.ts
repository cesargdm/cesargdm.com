import type { APIRoute } from 'astro'

import { cacheControl, ONE_DAY_SECONDS } from '@/lib/fetch-cache'
import { getNfts } from '@/lib/open-sea'

export const prerender = false

export const GET: APIRoute = async () => {
	// `getNfts` logs and degrades to an empty list rather than throwing, so the
	// catch this route used to carry could never fire.
	return new Response(JSON.stringify(await getNfts()), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': cacheControl(ONE_DAY_SECONDS),
		},
	})
}
