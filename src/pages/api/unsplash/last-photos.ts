import type { APIRoute } from 'astro'
import { createApi } from 'unsplash-js'

export const prerender = false

// 24 hours
const REVALIDATE = 86400

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
	fetch: fetch,
})

export const GET: APIRoute = async () => {
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
