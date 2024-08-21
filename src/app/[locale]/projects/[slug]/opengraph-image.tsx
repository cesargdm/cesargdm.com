import { ImageResponse } from 'next/og'

import { getAssets } from '@/lib/assets'
import { BASE_URL } from '@/lib/constants'
import { fetchFonts, styles } from '@/lib/open-graph'

export const runtime = 'edge'

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

	const asset = data.projects.find((asset) => asset.slug === slug)

	return new ImageResponse(
		(
			<div style={styles.container}>
				<div style={styles.textContainer}>
					<p style={styles.heading}>cesargdm - Projects</p>
					<p style={styles.title}>{asset?.data?.title}</p>
					<p style={styles.extract}>{asset?.data.description}</p>
				</div>
				<img
					width={290}
					height={290}
					style={styles.rightImage}
					src={`${BASE_URL}/android-chrome-512x512.png`}
					alt=""
				/>
			</div>
		),
		{ ...size, fonts },
	)
}
