import { ImageResponse } from 'next/og'

import { getDefaultFonts, styles } from '@/lib/open-graph'
import { getNft } from '@/lib/open-sea'

export const alt = 'cesargdm NFT'

export const size = {
	width: 1200,
	height: 630,
}

export const contentType = 'image/png'

export default async function Image({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	// Previously matched on `asset_contract.address`/`token_id`, which are
	// OpenSea v1 fields the v2 API no longer returns — so this never matched.
	const nft = await getNft(id)

	if (!nft) return new ImageResponse(<div />, { ...size })

	const fonts = getDefaultFonts()

	return new ImageResponse(
		<div style={styles.container}>
			<div style={{ ...styles.textContainer, marginBottom: 470 }}>
				<p style={styles.heading}>cesargdm - NFTs</p>
				<p style={styles.title}>{nft.name}</p>
			</div>

			<img
				width={450}
				height={450}
				style={styles.nftImage}
				src={nft.image_url}
				alt=""
			/>
		</div>,
		{ ...size, fonts },
	)
}
