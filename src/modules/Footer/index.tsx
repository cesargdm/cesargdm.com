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

	const response = await fetch('https://cesargdm.com/api/slack/users-info', {
		next: { revalidate: ONE_DAY },
	})

	return response.json()
}

export default async function Footer() {
	const result = await getData()

	const date = new Date(
		new Date().toLocaleString('en-US', { timeZone: result.tz }),
	)

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

				{Boolean(result.tz) && (
					<li className={footerParagraph}>
						<b>Local time</b>
						{date.toLocaleTimeString(undefined, {
							hour: 'numeric',
							minute: 'numeric',
						})}
					</li>
				)}
			</ul>
		</footer>
	)
}
