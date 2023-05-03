import { IconExternalLink } from '@tabler/icons-react'
import { readTweetsLink, tweetParagraph } from './styles.css'

async function LastTweet() {
	const response = await fetch('https://cesargdm.com/api/twitter/last-tweets', {
		cache: 'force-cache',
	})
		.then((response) => response.json())
		.catch(() => undefined)

	console.log(response)

	const tweetText = response?.data?.text

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
