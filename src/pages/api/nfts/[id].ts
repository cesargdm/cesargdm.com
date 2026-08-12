import type { APIRoute } from 'astro'

import { getNft } from '@/lib/open-sea'

export const prerender = false

// 24 hours
const REVALIDATE = 86400

export const GET: APIRoute = async ({ params }) => {
	const { id } = params

	if (!id) {
		return new Response(JSON.stringify({ message: 'Not found' }), {
			status: 404,
			headers: { 'content-type': 'application/json; charset=utf-8' },
		})
	}

	const nft = await getNft(id)

	if (!nft) {
		return new Response(JSON.stringify({ message: 'Not found' }), {
			status: 404,
			headers: { 'content-type': 'application/json; charset=utf-8' },
		})
	}

	return new Response(JSON.stringify(nft), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': `public, s-maxage=${REVALIDATE}, stale-while-revalidate`,
		},
	})
}
