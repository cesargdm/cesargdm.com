import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { LOCALES } from '@/lib/i18n'

function getLocale(request: NextRequest): string | undefined {
	// Negotiator expects plain object so we need to transform headers
	const negotiatorHeaders: Record<string, string> = {}
	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

	const locales = LOCALES

	// Use negotiator and intl-localematcher to get best locale
	const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
		locales as unknown as string[],
	)

	const locale = matchLocale(languages, locales, LOCALES[0])

	return locale
}
export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	if (
		pathname.endsWith('.png') ||
		pathname.endsWith('.jpg') ||
		pathname.endsWith('.jpeg') ||
		pathname.endsWith('.webp') ||
		pathname.endsWith('.svg') ||
		pathname.endsWith('.gif') ||
		pathname.endsWith('.json') ||
		pathname.endsWith('.xml') ||
		pathname.endsWith('.ico')
	) {
		return
	}

	// Check if there is any supported locale in the pathname
	const pathnameIsMissingLocale = LOCALES.every(
		(locale) =>
			!pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
	)

	// Redirect if there is no locale
	if (pathnameIsMissingLocale) {
		const locale = getLocale(request)

		// e.g. incoming request is /products
		// The new URL is now /en-US/products
		return NextResponse.redirect(
			new URL(
				`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
				request.url,
			),
		)
	}
}

export const config = {
	matcher:
		'/((?!api|_next/static|_next/image|robots.txt|sitemap.xml|images|favicon.ico).*)',
}
