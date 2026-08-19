import { NextResponse } from 'next/server'

import { getCurrentlyReading } from '@/lib/goodreads'

/**
 * 24 hours
 */
export const revalidate = 86400

export async function GET() {
	return NextResponse.json(await getCurrentlyReading())
}
