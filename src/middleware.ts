import { match as matchLocale } from '@formatjs/intl-localematcher'
import { defineMiddleware } from 'astro:middleware'
import Negotiator from 'negotiator'

import { LOCALES } from '@/lib/i18n'
import type { Theme } from '@/modules/Nav/ToggleTheme/ThemeButton'
import { CookieName as ThemeCookieName } from '@/modules/Nav/ToggleTheme/ThemeButton'

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

export const onRequest = defineMiddleware((context, next) => {
	const { url, request, cookies, locals } = context
	const pathname = url.pathname

	locals.theme = (cookies.get(ThemeCookieName)?.value ?? '') as Theme

	// Skip API routes and static assets (images, sitemap.xml, favicon, etc.)
	if (pathname.startsWith('/api') || FILE_EXTENSION.test(pathname)) {
		return next()
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

	return next()
})
