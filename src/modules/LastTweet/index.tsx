import { IconExternalLink } from '@tabler/icons-react'

import Twitter from '@/assets/icons/Twitter'

import { readTweetsButton, tweetParagraph } from './styles.css'

function getData() {
	return fetch('https://cesargdm.com/api/twitter/last-tweets', {
		next: { revalidate: 60 * 60 * 24 },
	})
		.then((response) => response.json())
		.catch(() => undefined)
}

async function LastTweet() {
	const result = await getData()

	const tweetText = result?.data?.[0]?.text

	return (
		<>
			<h2>
				<Twitter style={{ width: 24, height: 24 }} aria-hidden />
				Tweets
			</h2>
			<p className={tweetParagraph}>{tweetText}</p>
			<a
				target="_blank"
				rel="noopener noreferrer"
				className={readTweetsButton}
				href="https://twitter.com/cesargdm"
				aria-label="Visit my Twitter profile"
			>
				Read more tweets
			</a>
		</>
	)
}

export default LastTweet
