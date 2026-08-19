import { NextResponse } from 'next/server'

import { getLastPhotos } from '@/lib/unsplash'

/**
 * 24 hours
 */
export const revalidate = 86400

export async function GET() {
	return NextResponse.json(await getLastPhotos())
}
