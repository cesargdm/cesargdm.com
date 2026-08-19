import { logIntegrationFailure } from '@/lib/log'

const BLUESKY_HANDLE = 'cesargdm.com'
const PUBLIC_API = 'https://public.api.bsky.app/xrpc'
const ONE_DAY_SECONDS = 86400

export type BlueskyProfile = {
	handle: string
	displayName?: string
	description?: string
	followersCount?: number
}

export type BlueskyPost = {
	text: string
	url: string
	createdAt: string
}

export type BlueskyFeed = {
	profile: BlueskyProfile
	latestPost?: BlueskyPost
}

/**
 * The public AppView needs no auth and no API key, unlike X — which moved
 * `users/me` behind per-read billing.
 */
async function fetchPublic<T>(path: string, params: Record<string, string>) {
	const query = new URLSearchParams(params).toString()

	const response = await fetch(`${PUBLIC_API}/${path}?${query}`, {
		next: { revalidate: ONE_DAY_SECONDS },
	})

	if (!response.ok) {
		throw new Error(`Bluesky ${path} responded ${response.status}`)
	}

	return response.json() as Promise<T>
}

function toPostUrl(uri: string, handle: string) {
	const rkey = uri.split('/').pop()

	return `https://bsky.app/profile/${handle}/post/${rkey}`
}

export async function getBlueskyFeed(): Promise<BlueskyFeed | undefined> {
	try {
		const profile = await fetchPublic<BlueskyProfile & { postsCount?: number }>(
			'app.bsky.actor.getProfile',
			{ actor: BLUESKY_HANDLE },
		)

		// Skip the feed round-trip entirely when the account has never posted.
		if (!profile.postsCount) {
			return { profile }
		}

		const feed = await fetchPublic<{
			feed: {
				post: { uri: string; record: { text?: string; createdAt?: string } }
			}[]
		}>('app.bsky.feed.getAuthorFeed', {
			actor: BLUESKY_HANDLE,
			limit: '1',
			filter: 'posts_no_replies',
		})

		const post = feed.feed?.[0]?.post

		if (!post?.record?.text) {
			return { profile }
		}

		return {
			profile,
			latestPost: {
				text: post.record.text,
				url: toPostUrl(post.uri, profile.handle),
				createdAt: post.record.createdAt ?? '',
			},
		}
	} catch (error) {
		logIntegrationFailure('bluesky', error)
		return undefined
	}
}
