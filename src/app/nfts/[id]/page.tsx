import NftInfo from '@/components/Nft'
import { findNft, getNfts } from '@/lib/open-sea'
import Link from 'next/link'

export default async function Nft({
	params: { id },
}: {
	params: { id: string }
}) {
	const nfts = await getNfts()

	if (!nfts) return null

	const nft = findNft(nfts, id)

	if (!nft) return null

	return (
		<div>
			<div>
				<Link href="/nfts">Back</Link>
			</div>
			<NftInfo {...nft} />
		</div>
	)
}
