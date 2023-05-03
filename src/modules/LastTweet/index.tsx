import { IconExternalLink } from '@tabler/icons-react'
import { readTweetsLink, tweetParagraph } from './styles.css'

async function LastTweet() {
	const staticData = await fetch('/api/twitter/last-tweet', {
		cache: 'force-cache',
	})
		.then((response) => response.json())
		.catch(() => undefined)

	const tweetText = staticData?.data?.text

	return (
		<>
			<h2>Tweets</h2>
			<p className={tweetParagraph}>{tweetText}</p>
			<a
				target="_blank"
				rel="noopener noreferrer"
				className={readTweetsLink}
				href="https://twitter.com/cesargdm"
			>
				Read more tweets
				<IconExternalLink />
			</a>
		</>
	)
}

export default LastTweet