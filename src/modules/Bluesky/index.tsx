import { IconBrandBluesky } from '@tabler/icons-react'

import { getBlueskyFeed } from '@/lib/bluesky'

import { bioParagraph, postParagraph, profileButton } from './styles.css'

export default async function Bluesky() {
	const feed = await getBlueskyFeed()

	const profileUrl = `https://bsky.app/profile/${feed?.profile.handle ?? 'cesargdm.com'}`

	return (
		<>
			<h2>
				<IconBrandBluesky aria-hidden />
				Bluesky
			</h2>

			{feed?.latestPost ? (
				<p className={postParagraph}>{feed.latestPost.text}</p>
			) : (
				<p className={bioParagraph}>
					{feed?.profile.description ?? '@cesargdm.com'}
				</p>
			)}

			<a
				target="_blank"
				rel="noopener noreferrer"
				className={profileButton}
				href={feed?.latestPost?.url ?? profileUrl}
				aria-label="Visit my Bluesky profile"
			>
				{feed?.latestPost ? 'Read the post' : 'Follow me on Bluesky'}
			</a>
		</>
	)
}
