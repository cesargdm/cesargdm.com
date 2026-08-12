import type { APIRoute } from 'astro'
import OAuth from 'oauth'

export const prerender = false

// 3 days
const REVALIDATE = 259200

const oauth = new OAuth.OAuth(
	'https://api.twitter.com/oauth/request_token',
	'https://api.twitter.com/oauth/access_token',
	process.env.X_API_KEY as string,
	process.env.X_API_KEY_SECRET as string,
	'1.0A',
	null,
	'HMAC-SHA1',
)

export const GET: APIRoute = async () => {
	try {
		const data = await new Promise((resolve, reject) =>
			oauth.get(
				'https://api.twitter.com/2/users/me?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld&expansions=pinned_tweet_id',
				process.env.X_ACCESS_TOKEN as string,
				process.env.X_ACCESS_TOKEN_SECRET as string,
				(error, body) => {
					if (error)
						return reject(
							new Error(error.statusCode?.toString() ?? 'Unknown error'),
						)

					return resolve(JSON.parse(body as string))
				},
			),
		)

		return new Response(JSON.stringify(data), {
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': `public, s-maxage=${REVALIDATE}, stale-while-revalidate`,
			},
		})
	} catch {
		return new Response(JSON.stringify({ message: 'Error' }), {
			status: 500,
			headers: { 'content-type': 'application/json; charset=utf-8' },
		})
	}
}
