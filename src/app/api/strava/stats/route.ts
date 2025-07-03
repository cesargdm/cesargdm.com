import { NextResponse } from 'next/server'

/**
 * 1 hour cache
 */
export const revalidate = 3600

const STRAVA_ATHLETE_ID = '93532048'

const { STRAVA_ACCESS_TOKEN } = process.env

export async function GET() {
	try {
		const response = await fetch(
			`https://www.strava.com/api/v3/athletes/${STRAVA_ATHLETE_ID}/stats`,
			{
				headers: { Authorization: `Bearer ${STRAVA_ACCESS_TOKEN}` },
			},
		)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = (await response.json()) as unknown

		return NextResponse.json(data, {
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		})
	} catch {
		return NextResponse.json(
			{ message: 'Error fetching Strava data' },
			{ status: 500 },
		)
	}
}
