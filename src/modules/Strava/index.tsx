import { BASE_URL } from '@/lib/constants'

import { statItem, statLabel, statsGrid, statValue, stravaContainer, stravaIcon, viewProfileButton } from './styles.css'

interface StravaStats {
	ytd_run_totals: {
		count: number
		distance: number
		moving_time: number
		elevation_gain: number
	}
	all_run_totals: {
		count: number
		distance: number
		moving_time: number
		elevation_gain: number
	}
}

function getData(): Promise<StravaStats | undefined> {
	// eslint-disable-next-line no-magic-numbers
	const ONE_HOUR = 60 * 60

	return fetch(`${BASE_URL}/api/strava/stats`, {
		next: { revalidate: ONE_HOUR },
	})
		.then((response) => response.json())
		.catch(() => undefined)
}

async function Strava() {
	const data = await getData()

	if (!data?.ytd_run_totals) {
		return (
			<div className={stravaContainer}>
				<h2>
					<svg 
						className={stravaIcon}
						viewBox="0 0 24 24" 
						fill="currentColor"
						aria-hidden
					>
						<path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172"/>
					</svg>
					Strava
				</h2>
				<p>Unable to load running stats</p>
				<a
					href="https://www.strava.com/athletes/93532048"
					target="_blank"
					rel="noopener noreferrer"
					className={viewProfileButton}
				>
					View Profile
				</a>
			</div>
		)
	}

	// Convert meters to kilometers
	const METERS_TO_KM = 1000
	const SECONDS_TO_HOURS = 3600
	
	const ytdDistanceKm = Math.round(data.ytd_run_totals.distance / METERS_TO_KM)
	const allTimeDistanceKm = Math.round(data.all_run_totals.distance / METERS_TO_KM)
	
	// Convert seconds to hours
	const ytdTimeHours = Math.round(data.ytd_run_totals.moving_time / SECONDS_TO_HOURS)

	return (
		<div className={stravaContainer}>
			<h2>
				<svg 
					className={stravaIcon}
					viewBox="0 0 24 24" 
					fill="currentColor"
					aria-hidden
				>
					<path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.172"/>
				</svg>
				Running Stats
			</h2>
			
			<div className={statsGrid}>
				<div className={statItem}>
					<div className={statValue}>{ytdDistanceKm} km</div>
					<div className={statLabel}>This Year</div>
				</div>
				<div className={statItem}>
					<div className={statValue}>{data.ytd_run_totals.count}</div>
					<div className={statLabel}>Runs (2024)</div>
				</div>
				<div className={statItem}>
					<div className={statValue}>{ytdTimeHours}h</div>
					<div className={statLabel}>Hours Run</div>
				</div>
				<div className={statItem}>
					<div className={statValue}>{allTimeDistanceKm} km</div>
					<div className={statLabel}>All Time</div>
				</div>
			</div>
			
			<a
				href="https://www.strava.com/athletes/93532048"
				target="_blank"
				rel="noopener noreferrer"
				className={viewProfileButton}
			>
				View Profile
			</a>
		</div>
	)
}

export default Strava