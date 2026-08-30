import type { APIRoute } from 'astro'

import {
	cacheControl,
	ONE_DAY_SECONDS,
	ONE_MINUTE_SECONDS,
} from '@/lib/fetch-cache'
import { getNft } from '@/lib/open-sea'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
	const { id } = params

	if (!id) {
		return new Response(JSON.stringify({ message: 'Not found' }), {
			status: 404,
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': cacheControl(ONE_MINUTE_SECONDS),
			},
		})
	}

	const nft = await getNft(id)

	if (!nft) {
		return new Response(JSON.stringify({ message: 'Not found' }), {
			status: 404,
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': cacheControl(ONE_MINUTE_SECONDS),
			},
		})
	}

	return new Response(JSON.stringify(nft), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': cacheControl(ONE_DAY_SECONDS),
		},
	})
}
