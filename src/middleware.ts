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

// Security headers previously configured in vercel.json.
const SECURITY_HEADERS: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	'Feature-Policy': "geolocation 'self'; microphone 'none'",
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'X-Frame-Options': 'DENY',
	'X-XSS-Protection': '1; mode=block',
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

		return context.redirect(`/${locale}${pathname}`)
	}

	return withSecurityHeaders(await next())
})
