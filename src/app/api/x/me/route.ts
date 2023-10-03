import { NextResponse } from 'next/server'
import OAuth from 'oauth'

/**
 * 3 days
 */
// eslint-disable-next-line no-magic-numbers
export const revalidate = 60 * 60 * 24 * 3

const oauth = new OAuth.OAuth(
	'https://api.twitter.com/oauth/request_token',
	'https://api.twitter.com/oauth/access_token',
	process.env.X_API_KEY as string,
	process.env.X_API_KEY_SECRET as string,
	'1.0A',
	null,
	'HMAC-SHA1',
)

export async function GET() {
	const data = await new Promise((resolve, reject) =>
		oauth.get(
			'https://api.twitter.com/2/users/me?user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld&expansions=pinned_tweet_id',
			process.env.X_ACCESS_TOKEN as string,
			process.env.X_ACCESS_TOKEN_SECRET as string,
			(error, data) => {
				if (error) return reject(error)

				return resolve(JSON.parse(data as string))
			},
		),
	)

	return NextResponse.json(data, {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	})
}
