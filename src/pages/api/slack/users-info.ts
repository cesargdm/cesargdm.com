import type { APIRoute } from 'astro'

export const prerender = false

// 24 hours
const REVALIDATE = 86400

const slackToken = process.env.SLACK_TOKEN as string
const userId = process.env.SLACK_USER_ID as string

export const GET: APIRoute = async () => {
	if (!slackToken || !userId) {
		return new Response(JSON.stringify({ message: 'Server error' }), {
			status: 500,
			headers: { 'content-type': 'application/json; charset=utf-8' },
		})
	}

	const data = await fetch(
		`https://slack.com/api/users.info?user=${userId}&pretty=1`,
		{ headers: { Authorization: `Bearer ${slackToken}` } },
	).then((response) => response.json() as Promise<{ user: object }>)

	return new Response(JSON.stringify(data.user), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': `public, s-maxage=${REVALIDATE}, stale-while-revalidate`,
		},
	})
}
