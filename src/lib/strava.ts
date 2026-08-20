import { env } from 'cloudflare:workers'

import { cached, ONE_HOUR_SECONDS } from '@/lib/fetch-cache'
import { readJson } from '@/lib/json'
import { logIntegrationFailure } from '@/lib/log'

const METERS_PER_KILOMETER = 1000
const SECONDS_PER_MINUTE = 60
const MILLISECONDS_PER_SECOND = 1000
const ACTIVITY_PAGE_SIZE = 100
const TOKEN_EXPIRY_MARGIN_SECONDS = 60
const MAX_PAGES = 4

/**
 * Strava classifies runs under several sport types; matching only `Run` hides
 * a trail or treadmill run and surfaces an older activity instead.
 */
const RUN_SPORT_TYPES = new Set(['Run', 'TrailRun', 'VirtualRun'])

/**
 * Includes the plain `Ride`, which is what the Strava app records by default
 * unless the activity is explicitly retyped — filtering to MountainBikeRide
 * alone matched nothing and left the card blank.
 */
const RIDE_SPORT_TYPES = new Set([
	'Ride',
	'MountainBikeRide',
	'EMountainBikeRide',
	'GravelRide',
])

export type Run = {
	id: number
	name: string
	url: string
	distanceKm: number
	movingTimeMinutes: number
	/** Local wall-clock time of the activity, expressed as a UTC instant. */
	startDateLocal: string
}

export type YearTotal = {
	year: number
	/** Total distance in kilometres. */
	distanceKm: number
	/** Total elevation gain in metres. */
	elevationM: number
	activityCount: number
	/** The most recent activity of this kind, for the card's subtitle. */
	latest?: Run
}

type StravaActivity = {
	id: number
	name: string
	distance: number
	moving_time: number
	total_elevation_gain?: number
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
 * presented: Strava may rotate it, and there is nowhere to persist a new one.
 */
async function getAccessToken() {
	if (cachedToken && cachedToken.expiresAt > Date.now()) {
		return cachedToken.value
	}

	const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = env

	if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
		throw new Error(
			'STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET or STRAVA_REFRESH_TOKEN is not set',
		)
	}

	const response = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({
			client_id: STRAVA_CLIENT_ID,
			client_secret: STRAVA_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: STRAVA_REFRESH_TOKEN,
		}),
	})

	if (!response.ok) {
		throw new Error(`Strava token exchange responded ${response.status}`)
	}

	const data = await readJson<{
		access_token?: string
		expires_in?: number
		refresh_token?: string
	}>(response)

	if (!data.access_token) {
		throw new Error('Strava token exchange returned no access_token')
	}

	// A rotated refresh token invalidates the configured one. Say so explicitly —
	// the card will disappear until STRAVA_REFRESH_TOKEN is updated.
	if (data.refresh_token && data.refresh_token !== STRAVA_REFRESH_TOKEN) {
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

function toRun(activity: StravaActivity): Run {
	return {
		id: activity.id,
		name: activity.name,
		url: `https://www.strava.com/activities/${activity.id}`,
		distanceKm: activity.distance / METERS_PER_KILOMETER,
		movingTimeMinutes: activity.moving_time / SECONDS_PER_MINUTE,
		startDateLocal: activity.start_date_local ?? activity.start_date,
	}
}

/**
 * Every activity since 1 January, newest first.
 *
 * `after` is what keeps this to one request: without it a busy year would need
 * paging, and the totals would silently be short by whatever fell off the end
 * of the first page.
 */
let activitiesPromise: Promise<StravaActivity[]> | undefined

function getActivitiesThisYear(): Promise<StravaActivity[]> {
	// The run and ride cards both need the same list and render in the same
	// pass; without this they would each page through the year separately.
	activitiesPromise ??= fetchActivitiesThisYear()

	return activitiesPromise
}

async function fetchActivitiesThisYear(): Promise<StravaActivity[]> {
	const accessToken = await getAccessToken()

	const year = new Date().getUTCFullYear()
	const after = Math.floor(Date.UTC(year, 0, 1) / MILLISECONDS_PER_SECOND)

	const activities: StravaActivity[] = []

	for (let page = 1; page <= MAX_PAGES; page++) {
		const response = await fetch(
			`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=${ACTIVITY_PAGE_SIZE}&page=${page}`,
			{
				...cached(ONE_HOUR_SECONDS),
				headers: { Authorization: `Bearer ${accessToken}` },
			},
		)

		if (!response.ok) {
			throw new Error(`Strava activities responded ${response.status}`)
		}

		const batch = await readJson<StravaActivity[]>(response)

		activities.push(...batch)

		if (batch.length < ACTIVITY_PAGE_SIZE) break
	}

	return activities
}

function summarise(
	activities: StravaActivity[],
	sportTypes: Set<string>,
): YearTotal {
	const matching = activities.filter((activity) =>
		sportTypes.has(activity.sport_type ?? activity.type ?? ''),
	)

	// `after` returns oldest-first, so the last match is the most recent one.
	const latest = matching.at(-1)

	return {
		year: new Date().getUTCFullYear(),
		distanceKm: matching.reduce(
			(total, activity) => total + activity.distance / METERS_PER_KILOMETER,
			0,
		),
		elevationM: matching.reduce(
			(total, activity) => total + (activity.total_elevation_gain ?? 0),
			0,
		),
		activityCount: matching.length,
		latest: latest ? toRun(latest) : undefined,
	}
}

/** Distance run so far this year, plus the most recent run. */
export async function getRunTotal(): Promise<YearTotal | undefined> {
	try {
		return summarise(await getActivitiesThisYear(), RUN_SPORT_TYPES)
	} catch (error) {
		logIntegrationFailure('strava:run', error)
		return undefined
	}
}

/** Elevation climbed on a mountain bike so far this year. */
export async function getRideTotal(): Promise<YearTotal | undefined> {
	try {
		return summarise(await getActivitiesThisYear(), RIDE_SPORT_TYPES)
	} catch (error) {
		logIntegrationFailure('strava:ride', error)
		return undefined
	}
}
