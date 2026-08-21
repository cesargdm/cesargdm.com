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
		// v8 replaced the namespaced SDK (`.users.getPhotos`) with an
		// openapi-fetch client: endpoints are addressed by path, and the result
		// is `{ data, error }` rather than `{ response, errors }`.
		const { data, error } = await createApi({
			accessKey: env.UNSPLASH_ACCESS_KEY,
			fetch: cachedFetch,
		}).GET('/users/{username}/photos', {
			params: {
				path: { username: UNSPLASH_USERNAME },
				query: { per_page: PHOTO_COUNT },
			},
		})

		if (error) {
			throw new Error(error.errors?.join(', ') ?? 'Unsplash returned an error')
		}

		// The raw payload carries per-language slugs and link maps we never use;
		// narrowing here keeps it out of the server/client boundary.
		return (data ?? []).map((photo) => ({
			id: photo.id,
			url: photo.urls.regular,
			// The API returns `alt_description` — machine-generated alt text —
			// but v8's generated schema omits it and only types the
			// user-written `description`, which is null on most photos. Falling
			// back to it alone would empty out the alt attributes, so read the
			// real field and keep `description` as the fallback.
			alt:
				(photo as { alt_description?: string | null }).alt_description ??
				photo.description ??
				'',
			width: photo.width,
			height: photo.height,
		}))
	} catch (error) {
		logIntegrationFailure('unsplash', error)
		return []
	}
}
