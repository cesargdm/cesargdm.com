import { NextResponse } from 'next/server'

import { getNfts } from '@/lib/open-sea'

/**
 * 24 hours
 */
export const revalidate = 86400

export async function GET() {
	return NextResponse.json(await getNfts())
}
