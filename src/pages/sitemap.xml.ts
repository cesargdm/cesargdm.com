import type { APIRoute } from 'astro'

import { getPosts } from '@/lib/blog'
import { BASE_URL } from '@/lib/constants'
import { toTimestamp } from '@/lib/date'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'
import { getAlternateLocalePath } from '@/lib/locale-path'
import { getNfts } from '@/lib/open-sea'
import { getProjects } from '@/lib/projects'

export const prerender = false

const STATIC_PATHS = [
	'',
	'projects',
	'blog',
	'contact',
	'nfts',
	'chat',
	'search',
]

type Entry = {
	path: string
	locale: Locale
	lastmod: string
}

function render({ path, locale, lastmod }: Entry) {
	const loc = `${BASE_URL}${path}`

	// Only claim an alternate where one actually exists. The resolver falls back
	// to a shorter path (the section index, or home) when a page has no
	// translation, so an alternate with fewer segments means there isn't one —
	// and advertising a translation that redirects is worse than advertising none.
	const depth = path.split('/').length

	const alternates = LOCALES.filter((other) => other !== locale)
		.map((other) => ({
			other,
			alt: getAlternateLocalePath(locale, other, path),
		}))
		.filter(({ alt }) => alt.split('/').length === depth)
		.map(
			({ other, alt }) =>
				`<xhtml:link rel="alternate" hreflang="${other}" href="${BASE_URL}${alt}" />`,
		)
		.join('')

	return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod>${alternates}</url>`
}

function isoDate(value: unknown, fallback: string) {
	const timestamp = toTimestamp(value)

	return timestamp ? new Date(timestamp).toISOString() : fallback
}

export const GET: APIRoute = async () => {
	const now = new Date().toISOString()
	const nfts = await getNfts()

	const entries: Entry[] = LOCALES.flatMap((locale) => [
		// Every URL carries its locale prefix. The unprefixed forms this used to
		// emit are redirects, and a sitemap should list the final URL.
		...STATIC_PATHS.map((path) => ({
			path: path ? `/${locale}/${path}` : `/${locale}`,
			locale,
			lastmod: now,
		})),
		...getProjects(locale).map((project) => ({
			path: `/${locale}/projects/${project.slug}`,
			locale,
			lastmod: isoDate(project.data.date, now),
		})),
		...getPosts(locale).map((post) => ({
			path: `/${locale}/blog/${post.slug}`,
			locale,
			lastmod: isoDate(post.data.date, now),
		})),
		...nfts.map((nft) => ({
			path: `/${locale}/nfts/ethereum_${nft.contract}_${nft.identifier}`,
			locale,
			lastmod: now,
		})),
	])

	const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries
		.map(render)
		.join('')}</urlset>`

	return new Response(body, {
		headers: { 'content-type': 'application/xml; charset=utf-8' },
	})
}
