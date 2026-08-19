import { logIntegrationFailure } from '@/lib/log'

const ONE_HOUR_SECONDS = 3600
const METERS_PER_KILOMETER = 1000
const SECONDS_PER_MINUTE = 60
const MILLISECONDS_PER_SECOND = 1000
const ACTIVITY_PAGE_SIZE = 100
const TOKEN_EXPIRY_MARGIN_SECONDS = 60

/**
 * Strava classifies runs under several sport types; matching only `Run` hides
 * a trail or treadmill run and surfaces an older activity instead.
 */
const RUN_SPORT_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun'])

export type Run = {
	id: number
	name: string
	url: string
	distanceKm: number
	movingTimeMinutes: number
	/** Local wall-clock time of the activity, expressed as a UTC instant. */
	startDateLocal: string
}

type StravaActivity = {
	id: number
	name: string
	distance: number
	moving_time: number
	start_date: string
	start_date_local?: string
	sport_type?: string
	type?: string
}

let cachedToken: { value: string; expiresAt: number } | undefined

/**
 * Strava access tokens expire after six hours, so a stored access token is
 * never viable — only the refresh token is long-lived.
 *
 * The exchanged token is cached until shortly before it expires. Besides saving
 * a round-trip per render, this minimises how often the refresh token is
 * presented: Strava may rotate it, and a serverless request has nowhere to
 * persist a new one.
 */
async function getAccessToken() {
	if (cachedToken && cachedToken.expiresAt > Date.now()) {
		return cachedToken.value
	}

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
		expires_in?: number
		refresh_token?: string
	}

	if (!data.access_token) {
		throw new Error('Strava token exchange returned no access_token')
	}

	// A rotated refresh token invalidates the configured one. There is nowhere
	// to persist it from a serverless request, so say so explicitly — the card
	// will disappear until STRAVA_REFRESH_TOKEN is updated.
	if (data.refresh_token && data.refresh_token !== refreshToken) {
		logIntegrationFailure(
			'strava',
			'refresh token was rotated — update STRAVA_REFRESH_TOKEN or the card will stop working',
		)
	}

	const lifetime = data.expires_in ?? ONE_HOUR_SECONDS

	cachedToken = {
		value: data.access_token,
		expiresAt:
			Date.now() +
			(lifetime - TOKEN_EXPIRY_MARGIN_SECONDS) * MILLISECONDS_PER_SECOND,
	}

	return cachedToken.value
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
		const run = activities.find((activity) =>
			RUN_SPORT_TYPES.has(activity.sport_type ?? activity.type ?? ''),
		)

		if (!run) return undefined

		return {
			id: run.id,
			name: run.name,
			url: `https://www.strava.com/activities/${run.id}`,
			distanceKm: run.distance / METERS_PER_KILOMETER,
			movingTimeMinutes: run.moving_time / SECONDS_PER_MINUTE,
			startDateLocal: run.start_date_local ?? run.start_date,
		}
	} catch (error) {
		logIntegrationFailure('strava', error)
		return undefined
	}
}
