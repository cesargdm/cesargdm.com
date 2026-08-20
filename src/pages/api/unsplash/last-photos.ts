import type { APIRoute } from 'astro'

import { ONE_DAY_SECONDS } from '@/lib/fetch-cache'
import { getLastPhotos } from '@/lib/unsplash'

export const prerender = false

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify(await getLastPhotos()), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': `public, s-maxage=${ONE_DAY_SECONDS}, stale-while-revalidate`,
		},
	})
}
