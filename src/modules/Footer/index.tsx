import Link from 'next/link'

import LocalTime from '@/modules/Footer/LocalTime'

import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'
import { getTimeZone } from '@/lib/slack'

import { footerContainer, footerList, footerParagraph } from './styles.css'

export default async function Footer({ locale }: { locale: Locale }) {
	const timeZone = await getTimeZone()

	const date = new Date(new Date().toLocaleString('en-US', { timeZone }))

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

				<LocalTime timeZone={timeZone} />
			</ul>

			<p>
				<Link href={`/${alternateLocale}`}>{alternateLocale}</Link>
			</p>
		</footer>
	)
}
