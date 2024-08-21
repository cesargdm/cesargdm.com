import Link from 'next/link'

import NftInfo from '@/components/Nft'

import { getMetadata } from '@/lib/metadata'
import { getNft } from '@/lib/open-sea'

type Params = {
	id: string
}

export async function generateMetadata({ params }: { params: Params }) {
	const nft = await getNft(params.id)

	if (!nft) return getMetadata()

	return getMetadata({
		type: 'article',
		title: `${nft.name} - NFTs`,
		alternates: {
			canonical: `/nfts/ethereum_${nft.contract}_${nft.identifier}`,
		},
	})
}

export default async function Nft({ params }: { params: Params }) {
	const nft = await getNft(params.id)

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
