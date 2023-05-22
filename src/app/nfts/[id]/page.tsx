import Link from 'next/link'

import NftInfo from '@/components/Nft'
import { getNft } from '@/lib/open-sea'
import { openGraph } from '@/lib/metadata'

type Params = {
	id: string
}

export async function generateMetadata({ params }: { params: Params }) {
	const nft = await getNft(params.id)

	if (!nft) return {}

	return {
		title: `${nft.name} - NFTs`,
		openGraph: {
			...openGraph,
			type: 'article',
			title: `${nft.name} - NFTs`,
		},
	}
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
