import { NextResponse } from 'next/server'

const slackToken = process.env.SLACK_TOKEN as string

/**
 * 24 hours
 */
export const revalidate = 60 * 60 * 24

export async function GET() {
	const userId = 'U01E4JHJVJQ'

	if (!slackToken) {
		return NextResponse.json({ message: 'Server error' })
	}

	const data = await fetch(
		`https://slack.com/api/users.info?user=${userId}&pretty=1`,
		{ headers: { Authorization: `Bearer ${slackToken}` } },
	).then((response) => response.json())

	return NextResponse.json(data.user)
}
