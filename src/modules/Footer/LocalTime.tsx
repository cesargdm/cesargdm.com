import { useEffect, useState } from 'react'

const ONE_SECOND = 1000

function getLocaleTimeString(timeZone: string) {
	return new Date().toLocaleTimeString('en-US', {
		timeZone,
		hour: 'numeric',
		minute: 'numeric',
	})
}

/**
 * Renders only the time — the surrounding <li> lives in Footer.astro so the
 * island wrapper cannot land between <ul> and <li>.
 *
 * Mounted with client:only because a clock rendered on the server is stale by
 * definition, and the difference showed up as a hydration mismatch.
 */
export default function LocalTime({ timeZone }: { timeZone: string }) {
	const [date, setDate] = useState(() => getLocaleTimeString(timeZone))

	useEffect(() => {
		const interval = setInterval(
			() => setDate(getLocaleTimeString(timeZone)),
			ONE_SECOND,
		)

		return () => clearInterval(interval)
	}, [timeZone])

	return <time>{date}</time>
}
