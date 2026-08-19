import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getAssets } from '@/lib/assets'
import { LOCALES } from '@/lib/i18n'

export function GET(request: NextRequest) {
	const requested = request.nextUrl.searchParams.get('locale')

	// Resolve to an entry from LOCALES rather than passing the query value
	// through, so an unknown locale can only fall back to the default.
	const locale = LOCALES.find((known) => known === requested) ?? LOCALES[0]

	return NextResponse.json(getAssets(locale))
}
