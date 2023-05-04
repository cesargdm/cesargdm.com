import { footerContainer, footerParagraph } from './styles.css'

function getData() {
	/**
	 * This api call will return the time zone set on my Slack profile.
	 * Since I always open slack on my computer, this will be the most
	 * accurate way to get my local time.
	 */
	return fetch('https://cesargdm.com/api/slack/users-info', {
		next: { revalidate: 60 * 60 * 24 },
	}).then((response) => response.json())
}

export default async function Footer() {
	const result = await getData()

	const date = new Date(
		new Date().toLocaleString('en-US', { timeZone: result.tz }),
	)

	return (
		<footer className={footerContainer}>
			<p className={footerParagraph}>
				<b>Copyright</b>
				{date.getFullYear()} &copy; César Guadarrama
			</p>

			<p className={footerParagraph}>
				<b>Local time</b>
				{date.toLocaleTimeString(undefined, {
					hour: 'numeric',
					minute: 'numeric',
				})}
			</p>
		</footer>
	)
}
