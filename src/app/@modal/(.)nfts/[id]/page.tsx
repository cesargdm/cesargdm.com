import Link from 'next/link'

import NftInfo from '@/components/Nft'

import { findNft, getNfts } from '@/lib/open-sea'

export default async function Nft({
	params: { id },
}: {
	params: { id: string }
}) {
	if (!id) return null

	const nfts = await getNfts()
	if (!nfts) return null

	const nft = await findNft(nfts, id)

	if (!nft) return null

	return (
		<dialog
			style={{
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				position: 'fixed',
				paddingTop: '60px',
				backgroundColor: 'rgba(0,0,0,0.1)',
			}}
			open
		>
			<div
				style={{
					top: '50%',
					left: '50%',
					width: '100%',
					height: '100%',
					maxWidth: '600px',
					maxHeight: '600px',
					position: 'absolute',
					borderRadius: '10px',
					backgroundColor: 'white',
					transform: 'translate(-50%, -50%)',
				}}
			>
				<div>
					<Link href="/nfts">Close</Link>
				</div>
				<NftInfo {...nft} />
			</div>
		</dialog>
	)
}
