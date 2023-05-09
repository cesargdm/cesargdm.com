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

async function getData() {
	'use server'

	return fetch(
		'https://api.opensea.io/api/v1/assets?owner=0xE3a856E4034D25FF68b3702B8f1618173BBFa130&limit=100',
		{
			next: { revalidate: 60 * 60 },
			headers: { 'X-API-KEY': process.env.OPENSEA_API_KEY as string },
		},
	)
		.then((response) => response.json())
		.then((data) =>
			(data.assets ?? []).sort((a: any, b: any) => {
				return (
					Number(b?.last_sale?.total_price ?? 0) -
					Number(a?.last_sale?.total_price ?? 0)
				)
			}),
		)
		.catch(() => undefined)
}

export default async function Nfts() {
	const data = await getData()

	return (
		<>
			<ul className={nftsList}>
				{data?.map?.((nft: any) => {
					if (!nft.image_url) return null

					return (
						<li className={nftItem} key={String(nft.id)}>
							<a
								href={nft.permalink}
								className={nftLink}
								target="_blank"
								rel="noopener noreferrer"
							>
								<div className={nftImageWrapper}>
									{nft.image_url && <Image src={nft.image_url} alt="" fill />}
								</div>
								<div className={nftTextWrapper}>
									<p className={nftName}>{nft.name}</p>
									<p className={nftDescription}>{nft.description}</p>
								</div>
							</a>
						</li>
					)
				})}
			</ul>
		</>
	)
}
