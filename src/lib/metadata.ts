import type { Metadata } from 'next'

import { BASE_URL } from './constants'
import type { PageProps } from './types'

type MetadataParams = {
	title?: string
	type?: 'article' | 'website'
	images?: string[]
	description?: string
	keywords?: Metadata['keywords']
} & Partial<Metadata>

export const title = 'cesargdm'

export const description =
	'César Guadarrama - Product engineer - Blog, portfolio and more'

export const images = [`${BASE_URL}/opengraph-image.png`]

export const openGraph: Metadata['openGraph'] = {
	title,
	images,
	description,
}

export const twitterUsername = '@cesargdm'

export const host = BASE_URL

export const twitter: Metadata['twitter'] = {
	title,
	images,
	description,
	site: twitterUsername,
	creator: twitterUsername,
	card: 'summary_large_image',
}

export const metadata = {
	metadataBase: new URL(BASE_URL),
	creator: 'cesargdm',
	category: 'technology',
	keywords: [
		'César Guadarrama Cantú',
		title,
		'software',
		'engineer',
		'javascript',
	],
	alternates: {
		canonical: host,
	},
	description,
	title: {
		default: title,
		template: `%s - ${title}`,
	},
	twitter,
	openGraph,
} as Metadata

type GenerateMetadataFunction<T = object> = (
	props: PageProps<T>,
) => MetadataParams | Promise<MetadataParams>

export function getMetadata<T = object>(
	generateMetadataFn: GenerateMetadataFunction<T>,
) {
	return async (pageProps: PageProps<T>): Promise<Metadata> => {
		const {
			title,
			images,
			keywords,
			description,
			type = 'website',
			...props
		} = await generateMetadataFn(pageProps)

		return {
			...props,
			title,
			keywords,
			description,
			openGraph: {
				...props.openGraph,
				...openGraph,
				type,
				title,
				images,
				description,
			},
			twitter: {
				...props.twitter,
				...twitter,
				title,
				images,
				description,
			},
			alternates: {
				...props.alternates,
				canonical: `${host}${props.alternates?.canonical?.toString() ?? ''}`,
			},
		}
	}
}
