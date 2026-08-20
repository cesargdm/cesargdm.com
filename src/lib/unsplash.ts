import { env } from 'cloudflare:workers'
import { createApi } from 'unsplash-js'

import { cached, ONE_DAY_SECONDS } from '@/lib/fetch-cache'
import { logIntegrationFailure } from '@/lib/log'

const UNSPLASH_USERNAME = 'cesargdm'
const PHOTO_COUNT = 3

export type Photo = {
	id: string
	url: string
	alt: string
	width: number
	height: number
}

/**
 * The SDK takes its own fetch, so caching has to be reapplied here — otherwise
 * every render spends an Unsplash request against a modest hourly quota.
 */
function cachedFetch(input: RequestInfo | URL, init?: RequestInit) {
	return fetch(input, { ...init, ...cached(ONE_DAY_SECONDS) })
}

export async function getLastPhotos(): Promise<Photo[]> {
	if (!env.UNSPLASH_ACCESS_KEY) {
		logIntegrationFailure('unsplash', 'UNSPLASH_ACCESS_KEY is not set')
		return []
	}

	try {
		const result = await createApi({
			accessKey: env.UNSPLASH_ACCESS_KEY,
			fetch: cachedFetch,
		}).users.getPhotos({
			username: UNSPLASH_USERNAME,
			perPage: PHOTO_COUNT,
		})

		if (result.errors) {
			throw new Error(result.errors.join(', '))
		}

		// The raw payload carries per-language slugs and link maps we never use;
		// narrowing here keeps it out of the server/client boundary.
		return (result.response?.results ?? []).map((photo) => ({
			id: photo.id,
			url: photo.urls.regular,
			alt: photo.alt_description ?? '',
			width: photo.width,
			height: photo.height,
		}))
	} catch (error) {
		logIntegrationFailure('unsplash', error)
		return []
	}
}
