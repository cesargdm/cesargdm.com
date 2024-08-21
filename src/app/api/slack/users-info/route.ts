import { NextResponse } from 'next/server'

/**
 * 24 hours
 */
// eslint-disable-next-line no-magic-numbers
export const revalidate = 60 * 60 * 24

const slackToken = process.env.SLACK_TOKEN as string
const userId = process.env.SLACK_USER_ID as string

export async function GET() {
	if (!slackToken || !userId) {
		return NextResponse.json({ message: 'Server error' }, { status: 500 })
	}

	const data = await fetch(
		`https://slack.com/api/users.info?user=${userId}&pretty=1`,
		{ headers: { Authorization: `Bearer ${slackToken}` } },
	).then((response) => response.json() as Promise<{ user: object }>)

	return NextResponse.json(data.user)
}
