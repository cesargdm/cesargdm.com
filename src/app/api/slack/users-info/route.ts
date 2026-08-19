import { NextResponse } from 'next/server'

import { getTimeZone } from '@/lib/slack'

/**
 * 24 hours
 */
export const revalidate = 86400

export async function GET() {
	return NextResponse.json({ tz: await getTimeZone() })
}
