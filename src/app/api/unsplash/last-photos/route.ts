import { NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
	fetch: fetch,
})

/**
 * 24 hours
 */
export const revalidate = 60 * 60 * 24

export async function GET() {
	const result = await unsplash.users.getPhotos({
		username: 'cesargdm',
		perPage: 3,
	})

	console.log({ result })

	return NextResponse.json(result?.response?.results ?? null)
}
