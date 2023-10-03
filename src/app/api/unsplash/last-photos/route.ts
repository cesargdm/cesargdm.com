import { NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
	fetch: fetch,
})

/**
 * 24 hours
 */
// eslint-disable-next-line no-magic-numbers
export const revalidate = 60 * 60 * 24

export async function GET() {
	const result = await unsplash.users.getPhotos({
		username: 'cesargdm',
		perPage: 3,
	})

	return NextResponse.json(result?.response?.results ?? null)
}
