import { match as matchLocale } from '@formatjs/intl-localematcher'
import { defineMiddleware } from 'astro:middleware'
import Negotiator from 'negotiator'

import type { Theme } from '@/modules/Nav/ToggleTheme/ThemeButton'
import { CookieName as ThemeCookieName } from '@/modules/Nav/ToggleTheme/ThemeButton'

import { LOCALES } from '@/lib/i18n'

function getLocale(request: Request): string {
	const negotiatorHeaders: Record<string, string> = {}
	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

	const locales = LOCALES as unknown as string[]

	const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
		locales,
	)

	return matchLocale(languages, locales, LOCALES[0])
}

const FILE_EXTENSION = /\.[a-zA-Z0-9]+$/

/**
 * Mirrors public/_headers, which covers prerendered pages and static assets —
 * middleware does not run for those. These apply to the on-demand routes.
 *
 * `Feature-Policy` and `X-XSS-Protection` from the old vercel.json are dropped:
 * the first is superseded by `Permissions-Policy`, and the second enables a
 * legacy auditor that is itself an XSS vector and is gone from modern browsers.
 */
const SECURITY_HEADERS: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'geolocation=(self), microphone=()',
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

function withSecurityHeaders(response: Response) {
	for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(key, value)
	}
	return response
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { url, request, cookies, locals } = context
	const pathname = url.pathname

	locals.theme = (cookies.get(ThemeCookieName)?.value ?? '') as Theme

	// Skip locale handling for API routes and static assets, but still render.
	if (pathname.startsWith('/api') || FILE_EXTENSION.test(pathname)) {
		return withSecurityHeaders(await next())
	}

	// Redirect if there is no locale prefix in the pathname
	const pathnameIsMissingLocale = LOCALES.every(
		(locale) =>
			!pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
	)

	if (pathnameIsMissingLocale) {
		const locale = getLocale(request)

		// Carry the query string across. Dropping it silently broke anything that
		// round-trips through a bare path — an OAuth callback to `/?code=…` lost
		// its code, and `/?query=…` lost the search term.
		return context.redirect(`/${locale}${pathname}${url.search}`)
	}

	return withSecurityHeaders(await next())
})
