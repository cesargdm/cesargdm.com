import type { Metadata } from 'next'

import { BASE_URL } from './constants'
import type { PageProps } from './types'

type MetadataParams = Omit<Partial<Metadata>, 'keywords'> & {
	title?: string
	type?: 'article' | 'website'
	images?: string[]
	description?: string
	keywords?: string[]
}

const title = 'cesargdm'

const description =
	'César Guadarrama - Product engineer - Blog, portfolio and more'

const images = [`${BASE_URL}/opengraph-image.png`]

const openGraph: Metadata['openGraph'] = {
	title,
	images,
	description,
}

const twitterUsername = '@cesargdm'

const host = BASE_URL

const twitter: Metadata['twitter'] = {
	title,
	images,
	description,
	site: twitterUsername,
	creator: twitterUsername,
	card: 'summary_large_image',
}

const defaultMetadata = {
	metadataBase: new URL(BASE_URL),
	creator: 'cesargdm',
	category: 'technology',
	alternates: {
		canonical: host,
	},
	twitter,
	openGraph,
	description,
	keywords: [
		'César Guadarrama Cantú',
		title,
		'software',
		'engineer',
		'javascript',
	],
} as const

type GenerateMetadataFunction<T = object> = (
	props: PageProps<T>,
) => MetadataParams | Promise<MetadataParams>

export function getMetadata<T = object>(
	generateMetadataFn: GenerateMetadataFunction<T> = () => ({}),
) {
	return async (pageProps: PageProps<T>): Promise<Metadata> => {
		const {
			title,
			images,
			keywords = defaultMetadata.keywords,
			description = defaultMetadata.description,
			type = 'website',
			...props
		} = await generateMetadataFn(pageProps)

		return {
			...props,
			title: {
				default: title as string,
				template: `%s - ${title}`,
			},
			creator: defaultMetadata.creator,
			keywords: keywords as string[],
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
				canonical: `${host}/${pageProps.params.locale}/${props.alternates?.canonical?.toString() ?? ''}`,
			},
		}
	}
}
