import Image from 'next/image'
import Link from 'next/link'

import { getMetadata } from '@/lib/metadata'
import { getNfts } from '@/lib/open-sea'

import {
	nftDescription,
	nftImageWrapper,
	nftItem,
	nftLink,
	nftName,
	nftsList,
	nftTextWrapper,
} from './styles.css'

export const metadata = getMetadata({
	title: 'NFTs',
	description: 'César Guadarrama Cantú - Product engineer - NFTs',
	alternates: { canonical: '/nfts' },
})

export default async function Nfts() {
	const data = await getNfts()

	return (
		<>
			<ul className={nftsList}>
				{data?.map?.((nft) => {
					if (!nft.image_url) return null

					return (
						<li key={String(nft.id)} className={nftItem}>
							<Link
								href={`/nfts/${nft.asset_contract.chain_identifier}_${nft.asset_contract.address}_${nft.token_id}`}
								className={nftLink}
							>
								<div className={nftImageWrapper}>
									{nft.image_url && <Image src={nft.image_url} alt="" fill />}
								</div>
								<div className={nftTextWrapper}>
									<p className={nftName}>{nft.name}</p>
									<p className={nftDescription}>{nft.description}</p>
								</div>
							</Link>
						</li>
					)
				})}
			</ul>
		</>
	)
}
