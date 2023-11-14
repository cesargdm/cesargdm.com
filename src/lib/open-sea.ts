export type Nft = {
	name: string
	description: string
	image_url: string
	contract: string
	identifier: string
	token_standard: string
	metadata_url: string
}

// eslint-disable-next-line require-await
export async function getNfts({
	chain = 'ethereum',
	owner = '0xE3a856E4034D25FF68b3702B8f1618173BBFa130',
} = {}): Promise<Nft[] | undefined> {
	'use server'

	// eslint-disable-next-line no-magic-numbers
	const ONE_MINUTE = 0 //60 * 60

	return (
		fetch(
			`https://api.opensea.io/api/v2/chain/${chain}/account/${owner}/nfts`,
			{
				next: { revalidate: ONE_MINUTE },
				headers: { 'X-API-KEY': process.env.OPENSEA_API_KEY as string },
			},
		)
			.then((response) => response.json())
			.then((data: { nfts: Nft[] }) =>
				data.nfts.filter(({ token_standard }) => token_standard !== 'erc20'),
			)
			// eslint-disable-next-line no-console
			.catch(() => undefined)
	)
}

// eslint-disable-next-line require-await
export async function findNft(
	nfts: Nft[],
	id: string,
): Promise<Nft | undefined> {
	return nfts.find((nft) => `ethereum_${nft.contract}_${nft.identifier}` === id)
}

export async function getNft(id: string): Promise<Nft | undefined> {
	const nfts = await getNfts()

	if (!nfts) return undefined

	return findNft(nfts, id)
}
