import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { createApi } from 'unsplash-js'

export const prerender = false

// 24 hours
const REVALIDATE = 86400

export const GET: APIRoute = async () => {
	const unsplash = createApi({
		accessKey: env.UNSPLASH_ACCESS_KEY ?? '',
		fetch: fetch,
	})

	const result = await unsplash.users.getPhotos({
		username: 'cesargdm',
		perPage: 3,
	})

	return new Response(JSON.stringify(result?.response?.results ?? null), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': `public, s-maxage=${REVALIDATE}, stale-while-revalidate`,
		},
	})
}
