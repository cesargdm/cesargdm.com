import { getAssets } from '@/lib/assets'
import { ImageResponse } from 'next/server'

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

	const asset = data.projects.find((asset: any) => asset.slug === slug)

	return new ImageResponse(
		(
			<div
				style={{
					background: 'white',
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					justifyContent: 'center',
					padding: 40,
					paddingRight: 400,
				}}
			>
				<p
					style={{
						fontSize: 80,
						width: '100%',
						lineHeight: 1,
						fontWeight: '900',
					}}
				>
					{asset?.data?.title}
				</p>
				<p style={{ fontSize: 35, opacity: 0.6 }}>{asset.data.description}</p>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					width={200}
					height={200}
					style={{
						bottom: 0,
						right: 0,
						width: 400,
						height: 400,
						position: 'absolute',
					}}
					src="https://cesargdm.com/android-chrome-512x512.png"
					alt=""
				/>
			</div>
		),
		{ ...size },
	)
}
