import { Metadata } from 'next'

type MetadataParams = {
	title?: string
	type?: 'article' | 'website'
	images?: string[]
	description?: string
	keywords?: Metadata['keywords']
}

export const title = 'cesargdm'

export const description =
	'César Guadarrama - Product engineer - Blog, portfolio and more'

export const images = ['https://cesargdm.com/opengraph-image.png']

export const openGraph: Metadata['openGraph'] = {
	title,
	images,
	description,
}

export const twitterUsername = '@cesargdm'

export const twitter: Metadata['twitter'] = {
	title,
	images,
	description,
	site: twitterUsername,
	creator: twitterUsername,
	card: 'summary_large_image',
}

export const metadata = {
	creator: 'cesargdm',
	category: 'technology',
	keywords: [
		'César Guadarrama Cantú',
		title,
		'software',
		'engineer',
		'javascript',
	],
	description,
	title: {
		default: title,
		template: `%s - ${title}`,
	},
	twitter,
	openGraph,
}

export const getMetadata = ({
	title,
	images,
	keywords,
	description,
	type = 'website',
}: MetadataParams | undefined = {}): Metadata => ({
	title,
	description,
	keywords,
	openGraph: {
		...openGraph,
		type,
		title,
		images,
		description,
	},
	twitter: {
		...twitter,
		title,
		images,
		description,
	},
})
