import { NextResponse } from 'next/server'

const slackToken = process.env.SLACK_TOKEN as string

/**
 * 24 hours
 */
// eslint-disable-next-line no-magic-numbers
export const revalidate = 60 * 60 * 24

const userId = process.env.SLACK_USER_ID as string

export async function GET() {
	if (!slackToken) {
		return NextResponse.json({ message: 'Server error' })
	}

	const data = await fetch(
		`https://slack.com/api/users.info?user=${userId}&pretty=1`,
		{ headers: { Authorization: `Bearer ${slackToken}` } },
	).then((response) => response.json() as Promise<{ user: object }>)

	return NextResponse.json(data.user)
}
