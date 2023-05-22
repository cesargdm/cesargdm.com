export type Nft = {
	id: string
	name: string
	description: string
	token_id: string
	image_url: string
	asset_contract: {
		address: string
		chain_identifier: string
	}
}

export async function getNfts({
	owner = '0xE3a856E4034D25FF68b3702B8f1618173BBFa130',
} = {}): Promise<Nft[] | undefined> {
	'use server'

	return fetch(
		`https://api.opensea.io/api/v1/assets?owner=${owner}&limit=100`,
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

export function findNft(nfts: Nft[], id: string): Nft | undefined {
	return nfts.find(
		(nft) =>
			`${nft.asset_contract.chain_identifier}_${nft.asset_contract.address}_${nft.token_id}` ===
			id,
	)
}

export async function getNft(id: string): Promise<Nft | undefined> {
	const nfts = await getNfts()

	if (!nfts) return undefined

	return findNft(nfts, id)
}