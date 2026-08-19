import { createApi } from 'unsplash-js'

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

export async function getLastPhotos(): Promise<Photo[]> {
	const accessKey = process.env.UNSPLASH_ACCESS_KEY

	if (!accessKey) {
		logIntegrationFailure('unsplash', 'UNSPLASH_ACCESS_KEY is not set')
		return []
	}

	try {
		const result = await createApi({ accessKey, fetch }).users.getPhotos({
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
