import type { APIRoute } from 'astro'

import { getNfts } from '@/lib/open-sea'

export const prerender = false

// 24 hours
const REVALIDATE = 86400

export const GET: APIRoute = async () => {
	try {
		const nfts = await getNfts()

		return new Response(JSON.stringify(nfts), {
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': `public, s-maxage=${REVALIDATE}, stale-while-revalidate`,
			},
		})
	} catch {
		return new Response(JSON.stringify({ message: 'Failed to fetch NFTs' }), {
			status: 500,
			headers: { 'content-type': 'application/json; charset=utf-8' },
		})
	}
}
