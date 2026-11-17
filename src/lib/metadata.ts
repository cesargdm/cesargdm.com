import { BASE_URL } from '@/lib/constants'
import type { Locale } from '@/lib/i18n'
import type { Alternate } from '@/lib/locale-path'
import { getAlternates } from '@/lib/locale-path'

const DEFAULT_TITLE = 'César Guadarrama C. - Product engineer'

const DEFAULT_DESCRIPTION: Record<Locale, string> = {
	en: 'César Guadarrama, product engineer: TypeScript, React, React Native and Cloudflare Workers. Fintech work, side projects like TOLO and Cretia, and a blog.',
	es: 'César Guadarrama, ingeniero de producto: TypeScript, React, React Native y Cloudflare Workers. Fintech, proyectos propios como TOLO y Cretia, y un blog.',
}

export const OG_LOCALE: Record<Locale, string> = { en: 'en_US', es: 'es_MX' }

const DEFAULT_IMAGES = [`${BASE_URL}/opengraph-image.png`]

const DEFAULT_KEYWORDS = [
	'César Guadarrama Cantú',
	DEFAULT_TITLE,
	'software',
	'engineer',
	'javascript',
]

export const TWITTER_USERNAME = '@cesargdm'

export type MetadataInput = {
	locale: Locale
	title?: string
	description?: string
	keywords?: string[]
	images?: string[]
	type?: 'article' | 'website'
	/** Path appended after the locale for the canonical URL, e.g. "/blog". */
	canonicalPath?: string
	/** Utility and not-found pages: kept out of search results and hreflang. */
	noindex?: boolean
}

export type ResolvedMetadata = {
	title: string
	description: string
	keywords: string[]
	images: string[]
	type: 'article' | 'website'
	canonical: string
	alternates: Alternate[]
	noindex: boolean
	creator: string
	twitterUsername: string
}

export function getMetadata(input: MetadataInput): ResolvedMetadata {
	const {
		locale,
		title,
		description = DEFAULT_DESCRIPTION[locale],
		keywords = DEFAULT_KEYWORDS,
		images = DEFAULT_IMAGES,
		type = 'website',
		canonicalPath = '',
		noindex = false,
	} = input
	const path = `/${locale}${canonicalPath}`

	const resolvedTitle = title ? `${title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE

	return {
		title: resolvedTitle,
		description,
		keywords,
		images,
		type,
		canonical: `${BASE_URL}${path}`,
		alternates: noindex ? [] : getAlternates(locale, path),
		noindex,
		creator: 'cesargdm',
		twitterUsername: TWITTER_USERNAME,
	}
}
