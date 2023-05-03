import { NextResponse } from 'next/server'

export async function GET() {
	const userId = '313716452'

	const data = await fetch(
		`https://api.twitter.com/2/users/${userId}/tweets?max_results=5&exclude=retweets,replies&expansions=attachments.media_keys`,
		{
			headers: {
				Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
			},
		},
	).then((response) => response.json())

	return NextResponse.json({ data })
}
