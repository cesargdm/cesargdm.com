import { NextResponse } from 'next/server'

import { getNfts } from '@/lib/open-sea'

/**
 * 24 hours
 */
// eslint-disable-next-line no-magic-numbers
export const revalidate = 60 * 60 * 24

export async function GET() {
	try {
		const nfts = await getNfts()

		return NextResponse.json(nfts, {
			headers: { 'content-type': 'application/json; charset=utf-8' },
		})
	} catch {
		return NextResponse.json(
			{ message: 'Failed to fetch NFTs' },
			{ status: 500 },
		)
	}
}
