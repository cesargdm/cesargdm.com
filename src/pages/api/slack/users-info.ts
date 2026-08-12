import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'

import { readJson } from '@/lib/json'

export const prerender = false

// 24 hours
const REVALIDATE = 86400

export const GET: APIRoute = async () => {
	const slackToken = env.SLACK_TOKEN
	const userId = env.SLACK_USER_ID

	if (!slackToken || !userId) {
		return new Response(JSON.stringify({ message: 'Server error' }), {
			status: 500,
			headers: { 'content-type': 'application/json; charset=utf-8' },
		})
	}

	const response = await fetch(
		`https://slack.com/api/users.info?user=${userId}&pretty=1`,
		{ headers: { Authorization: `Bearer ${slackToken}` } },
	)

	const data = await readJson<{ user: object }>(response)

	return new Response(JSON.stringify(data.user), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': `public, s-maxage=${REVALIDATE}, stale-while-revalidate`,
		},
	})
}
