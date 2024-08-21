import Link from 'next/link'

import LocalTime from '@/modules/Footer/LocalTime'

import { BASE_URL } from '@/lib/constants'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'

import { footerContainer, footerList, footerParagraph } from './styles.css'

/**
 * This api call will return the time zone set on my Slack profile.
 * Since I always open slack on my computer, this will be the most
 * accurate way to get my local time.
 */
async function getData() {
	'use server'

	// eslint-disable-next-line no-magic-numbers
	const ONE_DAY = 60 * 60 * 24

	return fetch(`${BASE_URL}/api/slack/users-info`, {
		next: { revalidate: ONE_DAY },
	})
		.then((response) => response.json() as Promise<{ tz: string }>)
		.catch(() => undefined)
}

export default async function Footer({ locale }: { locale: Locale }) {
	const result = await getData()

	const date = new Date(
		new Date().toLocaleString('en-US', { timeZone: result?.tz }),
	)

	const alternateLocale = LOCALES.find((l) => l !== locale)

	return (
		<footer className={footerContainer}>
			<ul className={footerList}>
				<li className={footerParagraph}>
					<b>Copyright</b>
					{date.getFullYear()} &copy; César Guadarrama
				</li>

				<li className={footerParagraph}>
					<b>Source</b>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://github.com/cesargdm/cesargdm.com"
					>
						GitHub
					</a>
				</li>

				{result?.tz ? <LocalTime timeZone={result.tz} /> : null}
			</ul>

			<p>
				<Link href={`/${alternateLocale}`}>{alternateLocale}</Link>
			</p>
		</footer>
	)
}
