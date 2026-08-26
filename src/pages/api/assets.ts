import type { APIRoute } from 'astro'

import { getPosts } from '@/lib/blog'
import {
	cacheControl,
	ONE_DAY_SECONDS,
	ONE_HOUR_SECONDS,
} from '@/lib/fetch-cache'
import { getProjects } from '@/lib/projects'

export const prerender = true

export const GET: APIRoute = () => {
	const language = undefined

	const projects = getProjects(language, { content: false })
	const posts = getPosts(language)

	return new Response(JSON.stringify({ projects, posts }), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': cacheControl(ONE_DAY_SECONDS, ONE_HOUR_SECONDS),
		},
	})
}
