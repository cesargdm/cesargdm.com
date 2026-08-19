import { IconBrandStrava } from '@tabler/icons-react'

import type { Locale } from '@/lib/i18n'
import { getLastRun } from '@/lib/strava'

import { distanceText, runContainer, runName, stravaButton } from './styles.css'

export default async function Strava({ locale }: { locale: Locale }) {
	const run = await getLastRun()

	if (!run) return null

	const formattedDate = new Intl.DateTimeFormat(locale, {
		day: 'numeric',
		month: 'long',
	}).format(new Date(run.startDate))

	return (
		<>
			<h2>
				<IconBrandStrava aria-hidden />
				Last run
			</h2>

			<div className={runContainer}>
				<p className={distanceText}>
					{run.distanceKm.toFixed(1)}
					<span style={{ fontSize: '1.5rem' }}> km</span>
				</p>
				<p className={runName}>{run.name}</p>
				<p>
					<small>
						{formattedDate} · {Math.round(run.movingTimeMinutes)} min
					</small>
				</p>
			</div>

			<a
				target="_blank"
				rel="noopener noreferrer"
				className={stravaButton}
				href={run.url}
			>
				View on Strava
			</a>
		</>
	)
}
