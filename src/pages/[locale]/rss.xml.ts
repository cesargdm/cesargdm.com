import type { APIRoute } from 'astro'

import { getPosts } from '@/lib/blog'
import { BASE_URL } from '@/lib/constants'
import { toTimestamp } from '@/lib/date'
import {
	cacheControl,
	ONE_DAY_SECONDS,
	ONE_HOUR_SECONDS,
} from '@/lib/fetch-cache'
import { text } from '@/lib/frontmatter'
import type { Locale } from '@/lib/i18n'
import { LOCALES } from '@/lib/i18n'
import { getTranslate } from '@/lib/translate'

export const prerender = true

export function getStaticPaths() {
	return LOCALES.map((locale) => ({ params: { locale } }))
}

const escape = (value: string) =>
	value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')

export const GET: APIRoute = ({ params }) => {
	const locale = params.locale as Locale
	const t = getTranslate(locale)

	const items = getPosts(locale)
		.map((post) => {
			const url = `${BASE_URL}/${locale}/blog/${post.slug}`
			const timestamp = toTimestamp(post.data.date)
			const pubDate = timestamp
				? `<pubDate>${new Date(timestamp).toUTCString()}</pubDate>`
				: ''

			return `<item><title>${escape(text(post.data.title, post.slug))}</title><link>${url}</link><guid>${url}</guid>${pubDate}<description>${escape(text(post.data.extract))}</description></item>`
		})
		.join('')

	const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escape(t('blog.feedTitle'))}</title><link>${BASE_URL}/${locale}/blog</link><description>${escape(t('blog.description'))}</description><language>${locale}</language><atom:link href="${BASE_URL}/${locale}/rss.xml" rel="self" type="application/rss+xml" />${items}</channel></rss>`

	return new Response(body, {
		headers: {
			'content-type': 'application/rss+xml; charset=utf-8',
			'cache-control': cacheControl(ONE_DAY_SECONDS, ONE_HOUR_SECONDS),
		},
	})
}
