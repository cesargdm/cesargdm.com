import Image from 'next/image'

import {
	nftItem,
	nftLink,
	nftName,
	nftsList,
	nftDescription,
	nftTextWrapper,
	nftImageWrapper,
} from './styles.css'
import Link from 'next/link'
import { getNfts } from '@/lib/open-sea'

export default async function Nfts() {
	const data = await getNfts()

	return (
		<>
			<ul className={nftsList}>
				{data?.map?.((nft, index) => {
					if (!nft.image_url) return null

					return (
						<li className={nftItem} key={String(nft.id)}>
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
