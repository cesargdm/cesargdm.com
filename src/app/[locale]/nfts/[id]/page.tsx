import Link from 'next/link'
import { notFound } from 'next/navigation'

import NftInfo from '@/components/Nft'

import { getMetadata } from '@/lib/metadata'
import { getNft } from '@/lib/open-sea'
import type { PageProps } from '@/lib/types'

type NftParams = { params: { id: string } }

export const generateMetadata = getMetadata<NftParams>(async (options) => {
	const nft = await getNft(options.params.id)

	if (!nft) notFound()

	return {
		type: 'article',
		title: `${nft.name} - NFTs`,
		alternates: {
			canonical: `/nfts/ethereum_${nft.contract}_${nft.identifier}`,
		},
	}
})

export default async function Nft({ params }: PageProps<NftParams>) {
	const { id, locale } = await params

	const nft = await getNft(id)

	if (!nft) {
		notFound()
	}

	return (
		<div>
			<div>
				<Link href={`/${locale}/nfts`}>Back</Link>
			</div>
			<NftInfo {...nft} />
		</div>
	)
}
