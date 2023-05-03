import { IconExternalLink } from '@tabler/icons-react'

import Twitter from '@/assets/icons/Twitter'

import { readTweetsLink, tweetParagraph } from './styles.css'

async function LastTweet() {
	const response = await fetch('https://cesargdm.com/api/twitter/last-tweets', {
		cache: 'force-cache',
	})
		.then((response) => response.json())
		.catch(() => undefined)

	const tweetText = response?.data?.[0]?.text

	return (
		<>
			<h2>
				<Twitter style={{ width: 24 }} />
				Tweets
			</h2>
			<p className={tweetParagraph}>{tweetText}</p>
			<a
				target="_blank"
				rel="noopener noreferrer"
				className={readTweetsLink}
				style={{ marginTop: 'auto' }}
				href="https://twitter.com/cesargdm"
			>
				Read more
				<IconExternalLink />
			</a>
		</>
	)
}

export default LastTweet
