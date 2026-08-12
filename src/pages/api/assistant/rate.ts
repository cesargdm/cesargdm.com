import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = () => {
	return new Response(null)
}
