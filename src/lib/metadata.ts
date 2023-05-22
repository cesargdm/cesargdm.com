import { Metadata } from 'next'

export const title = 'cesargdm'

export const description =
	'César Guadarrama - Product engineer - Blog, portfolio and more'

export const images = ['https://cesargdm.com/opengraph-image.png']

export const openGraph: Metadata['openGraph'] = {
	title,
	images,
	description,
}

export const twitter: Metadata['twitter'] = {
	title,
	images,
	description,
	site: '@cesargdm',
	creator: '@cesargdm',
	card: 'summary_large_image',
}
