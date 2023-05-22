import { getAssets } from '@/lib/assets'
import { ImageResponse } from 'next/server'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'About Acme'

export const size = {
	width: 1200,
	height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({
	params: { id },
}: {
	params: { id: string }
}) {
	const data = await getAssets()

	console.log({ data })

	return new ImageResponse(
		(
			<div
				style={{
					background: 'white',
					width: '100%',
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: 40,
				}}
			>
				<p
					style={{
						fontSize: 80,
						lineHeight: 1,
						marginRight: 400,
						fontWeight: '900',
					}}
				>
					This blog post is not ready
				</p>
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
