import { NextResponse } from 'next/server'

/**
 * 24 hours
 */
export const revalidate = 60 * 60 * 24

export async function GET() {
	const userId = 'U01E4JHJVJQ'

	const data = await fetch(
		`https://slack.com/api/users.info?user=${userId}&pretty=1`,
		{ headers: { Authorization: `Bearer ${process.env.SLACK_TOKEN}` } },
	).then((response) => response.json())

	return NextResponse.json(data.user)
}
