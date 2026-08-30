import { match as matchLocale } from '@formatjs/intl-localematcher'
import { defineMiddleware } from 'astro:middleware'
import Negotiator from 'negotiator'

import {
	cacheControl,
	ONE_HOUR_SECONDS,
	ONE_MINUTE_SECONDS,
} from '@/lib/fetch-cache'
import type { Locale } from '@/lib/i18n'
import { isLocale, LOCALES, withLocalePrefix } from '@/lib/i18n'
import type { Theme } from '@/modules/Nav/ToggleTheme/ThemeButton'
import { CookieName as ThemeCookieName } from '@/modules/Nav/ToggleTheme/ThemeButton'

function getLocale(request: Request): Locale {
	const negotiatorHeaders: Record<string, string> = {}
	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

	const locales = LOCALES as unknown as string[]

	const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
		locales,
	)

	const matched = matchLocale(languages, locales, LOCALES[0])

	return isLocale(matched) ? matched : LOCALES[0]
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

/**
 * Workers Cache (wrangler `cache.enabled`) applies RFC 9111 heuristics when a
 * 200 has no Cache-Control — two hours, which is longer than we want on a 404
 * and silent on routes that forgot a header. Only fill in the gap; routes that
 * already set Cache-Control (APIs, OG images) win.
 */
function withDefaultCacheControl(request: Request, response: Response) {
	if (request.method !== 'GET' && request.method !== 'HEAD') return response
	if (response.headers.has('cache-control')) return response
	if (response.status >= 300 && response.status < 400) return response

	if (response.status === 200) {
		response.headers.set('cache-control', cacheControl(ONE_HOUR_SECONDS))
	} else if (response.status === 404) {
		response.headers.set('cache-control', cacheControl(ONE_MINUTE_SECONDS))
	}

	return response
}

export const onRequest = defineMiddleware(async (context, next) => {
	const { url, request, cookies, locals } = context
	const pathname = url.pathname

	locals.theme = (cookies.get(ThemeCookieName)?.value ?? '') as Theme

	// Skip locale handling for API routes and static assets, but still render.
	if (pathname.startsWith('/api') || FILE_EXTENSION.test(pathname)) {
		return withSecurityHeaders(withDefaultCacheControl(request, await next()))
	}

	// Redirect if there is no locale prefix in the pathname
	const pathnameIsMissingLocale = LOCALES.every(
		(locale) =>
			!pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
	)

	if (pathnameIsMissingLocale) {
		const locale = getLocale(request)
		const response = context.redirect(
			withLocalePrefix(locale, pathname, url.search),
		)

		// Locale negotiation depends on Accept-Language. Never let a shared cache
		// pin the first visitor's locale onto everyone else.
		response.headers.set('cache-control', 'private, no-store')

		return withSecurityHeaders(response)
	}

	return withSecurityHeaders(withDefaultCacheControl(request, await next()))
})
