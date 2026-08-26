import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = () => {
	return new Response(JSON.stringify({ message: 'Forbidden' }), {
		status: 403,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'private, no-store',
		},
	})
}
