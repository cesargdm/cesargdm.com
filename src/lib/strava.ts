import { logIntegrationFailure } from '@/lib/log'

const ONE_HOUR_SECONDS = 3600
const METERS_PER_KILOMETER = 1000
const SECONDS_PER_MINUTE = 60
const ACTIVITY_PAGE_SIZE = 30

export type Run = {
	id: number
	name: string
	url: string
	distanceKm: number
	movingTimeMinutes: number
	startDate: string
}

type StravaActivity = {
	id: number
	name: string
	distance: number
	moving_time: number
	start_date: string
	sport_type?: string
	type?: string
}

/**
 * Strava access tokens expire after six hours, so a stored access token is
 * never viable — only the refresh token is long-lived. Every request exchanges
 * the refresh token for a fresh access token.
 */
async function getAccessToken() {
	const clientId = process.env.STRAVA_CLIENT_ID
	const clientSecret = process.env.STRAVA_CLIENT_SECRET
	const refreshToken = process.env.STRAVA_REFRESH_TOKEN

	if (!clientId || !clientSecret || !refreshToken) {
		throw new Error(
			'STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET or STRAVA_REFRESH_TOKEN is not set',
		)
	}

	const response = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		}),
		cache: 'no-store',
	})

	if (!response.ok) {
		throw new Error(`Strava token exchange responded ${response.status}`)
	}

	const data = (await response.json()) as {
		access_token?: string
		refresh_token?: string
	}

	if (!data.access_token) {
		throw new Error('Strava token exchange returned no access_token')
	}

	// Strava may rotate the refresh token. There is nowhere to persist it from a
	// stateless request, so surface it loudly rather than failing silently later.
	if (data.refresh_token && data.refresh_token !== refreshToken) {
		logIntegrationFailure(
			'strava',
			'refresh token was rotated — update STRAVA_REFRESH_TOKEN',
		)
	}

	return data.access_token
}

export async function getLastRun(): Promise<Run | undefined> {
	try {
		const accessToken = await getAccessToken()

		const response = await fetch(
			`https://www.strava.com/api/v3/athlete/activities?per_page=${ACTIVITY_PAGE_SIZE}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
				next: { revalidate: ONE_HOUR_SECONDS },
			},
		)

		if (!response.ok) {
			throw new Error(`Strava activities responded ${response.status}`)
		}

		const activities = (await response.json()) as StravaActivity[]

		// Activities come back newest-first across every sport, so filter rather
		// than taking the first entry.
		const run = activities.find(
			(activity) => (activity.sport_type ?? activity.type) === 'Run',
		)

		if (!run) return undefined

		return {
			id: run.id,
			name: run.name,
			url: `https://www.strava.com/activities/${run.id}`,
			distanceKm: run.distance / METERS_PER_KILOMETER,
			movingTimeMinutes: run.moving_time / SECONDS_PER_MINUTE,
			startDate: run.start_date,
		}
	} catch (error) {
		logIntegrationFailure('strava', error)
		return undefined
	}
}
