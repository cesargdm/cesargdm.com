import { NextResponse } from 'next/server'

/**
 * 24 hours
 */
export const revalidate = 60 * 60 * 24

const X_USER_ID = '313716452'

export async function GET() {
	try {
		const data = await fetch(
			`https://api.twitter.com/2/users/${X_USER_ID}/tweets?max_results=5&exclude=retweets,replies&expansions=attachments.media_keys&media.fields=url,type,public_metrics&tweet.fields=attachments,created_at,geo,public_metrics,source&place.fields=country`,
			{
				headers: {
					Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
				},
			},
		).then((response) => response.json())

		return NextResponse.json(data)
	} catch (error) {
		console.log({ error })

		return NextResponse.json(
			{ error: 'Error fetching tweets' },
			{ status: 500 },
		)
	}
}
