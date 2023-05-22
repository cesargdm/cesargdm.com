import { ImageResponse } from 'next/server'

import { getNfts } from '@/lib/open-sea'

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
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<p style={{ fontSize: '80px' }}>cesargdm</p>
					<p style={{ fontSize: '40px', fontWeight: '900' }}>{nft.name}</p>
				</div>

				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					style={{ borderRadius: 40, width: 300, height: 300 }}
					src={nft.image_url}
					alt=""
				/>
			</div>
		),
		{ ...size },
	)
}
