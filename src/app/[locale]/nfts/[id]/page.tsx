import Link from 'next/link'
import { notFound } from 'next/navigation'

import NftInfo from '@/components/Nft'

import { getMetadata } from '@/lib/metadata'
import { getNft } from '@/lib/open-sea'

type Params = {
	id: string
}

export const generateMetadata = getMetadata<{ params: { id: string } }>(
	async (options) => {
		const nft = await getNft(options.params.id)

		if (!nft) notFound()

		return {
			type: 'article',
			title: `${nft.name} - NFTs`,
			alternates: {
				canonical: `/nfts/ethereum_${nft.contract}_${nft.identifier}`,
			},
		}
	},
)

export default async function Nft({ params }: { params: Params }) {
	const nft = await getNft(params.id)

	if (!nft) {
		notFound()
	}

	return (
		<div>
			<div>
				<Link href="/nfts">Back</Link>
			</div>
			<NftInfo {...nft} />
		</div>
	)
}
