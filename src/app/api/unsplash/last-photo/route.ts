import { NextResponse } from 'next/server'
import { createApi } from 'unsplash-js'

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
	fetch: fetch,
})

export async function GET() {
	const data = await unsplash.users.getPhotos({ username: 'cesargdm' })

	return NextResponse.json(data.response?.results[0])
}