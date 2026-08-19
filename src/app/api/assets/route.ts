import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getAssets } from '@/lib/assets'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'

export function GET(request: NextRequest) {
	const requested = request.nextUrl.searchParams.get('locale')

	const locale = LOCALES.includes(requested as Locale)
		? (requested as Locale)
		: LOCALES[0]

	return NextResponse.json(getAssets(locale))
}
