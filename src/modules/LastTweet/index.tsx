import X from '@/assets/icons/X'

import { readTweetsButton, tweetParagraph } from './styles.css'

function getData() {
	return fetch('https://cesargdm.com/api/x/me', {
		next: { revalidate: 60 * 60 * 24 },
	})
		.then((response) => response.json())
		.catch(() => undefined)
}

async function LastTweet() {
	const result = await getData()

	const tweetText = result?.includes?.tweets.text
	const description = result?.data.description

	const readMore = (
		<a
			target="_blank"
			rel="noopener noreferrer"
			className={readTweetsButton}
			href="https://twitter.com/cesargdm"
			aria-label="Visit my Twitter profile"
		>
			Read more posts
		</a>
	)

	if (tweetText) {
		return (
			<>
				<h2>
					<X style={{ width: 24, height: 24 }} aria-hidden />
					Posts
				</h2>
				<p className={tweetParagraph}>{tweetText}</p>
				{readMore}
			</>
		)
	}

	if (description) {
		return (
			<>
				<h2>
					<X style={{ width: 24, height: 24 }} aria-hidden />
				</h2>
				<p className={tweetParagraph}>{result.data.description}</p>
				{readMore}
			</>
		)
	}

	return (
		<>
			<h2>
				<X style={{ width: 24, height: 24 }} aria-hidden />
			</h2>
			<p className={tweetParagraph}>@cesargdm</p>
			{readMore}
		</>
	)
}

export default LastTweet
