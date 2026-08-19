import { NextResponse } from 'next/server'

import { getLastRun } from '@/lib/strava'

/**
 * 1 hour
 */
export const revalidate = 3600

export async function GET() {
	return NextResponse.json((await getLastRun()) ?? null)
}
