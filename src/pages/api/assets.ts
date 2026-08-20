import type { APIRoute } from 'astro'

import { getPosts } from '@/lib/blog'
import { getProjects } from '@/lib/projects'

export const prerender = false

export const GET: APIRoute = () => {
	const language = undefined

	const projects = getProjects(language, { content: false })
	const posts = getPosts(language)

	return new Response(JSON.stringify({ projects, posts }), {
		headers: { 'content-type': 'application/json; charset=utf-8' },
	})
}
