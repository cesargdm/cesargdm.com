import { ImageResponse } from 'next/server'

import { getAssets } from '@/lib/assets'
import { fetchFonts, styles } from '@/lib/open-graph'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'cesargdm project'

export const size = {
	width: 1200,
	height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({
	params: { slug },
}: {
	params: { slug: string }
}) {
	const data = await getAssets()

	const fonts = await fetchFonts('Inter', [
		{
			weight: 400,
			url: 'https://rsms.me/inter/font-files/Inter-Regular.woff',
		},
		{
			weight: 600,
			url: 'https://rsms.me/inter/font-files/Inter-Black.woff',
		},
	])

	const asset = data.projects.find((asset: any) => asset.slug === slug)

	return new ImageResponse(
		(
			<div style={styles.container}>
				<div style={styles.textContainer}>
					<p style={styles.heading}>cesargdm - Projects</p>
					<p style={styles.title}>{asset?.data?.title}</p>
					<p style={styles.extract}>{asset.data.description}</p>
				</div>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					width={290}
					height={290}
					style={styles.rightImage}
					src="https://cesargdm.com/android-chrome-512x512.png"
					alt=""
				/>
			</div>
		),
		{ ...size, fonts },
	)
}
