import { ImageResponse } from 'next/server'

import { getNfts } from '@/lib/open-sea'
import { getDefaultFonts, styles } from '@/lib/open-graph'

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
	const data = await getNfts()

	if (!data) return new ImageResponse(<div />, { ...size })

	const nft = data.find(
		(nft: any) =>
			`${nft.asset_contract.chain_identifier}_${nft.asset_contract.address}_${nft.token_id}` ===
			id,
	)

	if (!nft) return new ImageResponse(<div />, { ...size })

	const fonts = await getDefaultFonts()

	return new ImageResponse(
		(
			<div style={styles.container}>
				<div style={{ ...styles.textContainer, marginBottom: 470 }}>
					<p style={styles.heading}>cesargdm - NFTs</p>
					<p style={styles.title}>{nft?.name}</p>
				</div>

				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					width={450}
					height={450}
					style={styles.nftImage}
					src={nft.image_url}
					alt=""
				/>
			</div>
		),
		{ ...size, fonts },
	)
}
