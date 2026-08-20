import { BASE_URL } from '@/lib/constants'
import type { Locale } from '@/lib/i18n'

const DEFAULT_TITLE = 'César Guadarrama C. - Product engineer'

const DEFAULT_DESCRIPTION =
	'César Guadarrama - Product engineer - Blog, portfolio and more'

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
}

export type ResolvedMetadata = {
	title: string
	description: string
	keywords: string[]
	images: string[]
	type: 'article' | 'website'
	canonical: string
	creator: string
	twitterUsername: string
}

export function getMetadata(input: MetadataInput): ResolvedMetadata {
	const {
		locale,
		title,
		description = DEFAULT_DESCRIPTION,
		keywords = DEFAULT_KEYWORDS,
		images = DEFAULT_IMAGES,
		type = 'website',
		canonicalPath = '',
	} = input

	const resolvedTitle = title ? `${title} - ${DEFAULT_TITLE}` : DEFAULT_TITLE

	return {
		title: resolvedTitle,
		description,
		keywords,
		images,
		type,
		canonical: `${BASE_URL}/${locale}${canonicalPath}`,
		creator: 'cesargdm',
		twitterUsername: TWITTER_USERNAME,
	}
}
