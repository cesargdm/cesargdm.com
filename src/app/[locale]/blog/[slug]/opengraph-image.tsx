import { ImageResponse } from 'next/og'

import { getAssets } from '@/lib/assets'
import type { Locale } from '@/lib/i18n'
import { getAvatarDataUri, getDefaultFonts, styles } from '@/lib/open-graph'

export const alt = 'cesargdm blog post'

export const size = {
	width: 1200,
	height: 630,
}

export const contentType = 'image/png'

export default async function Image({
	params,
}: {
	params: Promise<{ locale: Locale; slug: string }>
}) {
	const { locale, slug } = await params

	const data = getAssets(locale)
	const fonts = getDefaultFonts()

	const asset = data.posts.find((asset) => asset.slug === slug)

	return new ImageResponse(
		<div style={styles.container}>
			<div style={styles.textContainer}>
				<p style={styles.heading}>cesargdm - Blog</p>
				<p style={styles.title}>{asset?.data?.title as string}</p>
				<p style={styles.extract}>{asset?.data?.extract as string}</p>
			</div>
			<img
				width={290}
				height={290}
				style={styles.rightImage}
				src={getAvatarDataUri()}
				alt=""
			/>
		</div>,
		{ ...size, fonts },
	)
}
