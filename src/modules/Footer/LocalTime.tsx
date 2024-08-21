'use client'

import { useEffect, useState } from 'react'

import { footerParagraph } from '@/modules/Footer/styles.css'

const ONE_SECOND = 1000

function getLocaleTimeString({ timeZone }: { timeZone: string }) {
	return new Date().toLocaleTimeString('en-US', {
		timeZone,
		hour: 'numeric',
		minute: 'numeric',
	})
}

export default function LocalTime({ timeZone }: { timeZone: string }) {
	const [date, setDate] = useState(getLocaleTimeString({ timeZone }))

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(getLocaleTimeString({ timeZone }))
		}, ONE_SECOND)

		return () => clearInterval(interval)
	}, [])

	return (
		<li className={footerParagraph}>
			<b>Local time</b>
			{date}
		</li>
	)
}
