import { env } from 'cloudflare:workers'

import { readJson } from '@/lib/json'

export type Nft = {
	name: string
	description: string
	image_url: string
	contract: string
	identifier: string
	token_standard: string
	metadata_url: string
	asset_contract: Record<string, string>
	token_id: string
}

export async function getNfts({
	chain = 'ethereum',
	owner = '0xE3a856E4034D25FF68b3702B8f1618173BBFa130',
} = {}): Promise<Nft[] | undefined> {
	try {
		const response = await fetch(
			`https://api.opensea.io/api/v2/chain/${chain}/account/${owner}/nfts`,
			{
				headers: { 'X-API-KEY': env.OPENSEA_API_KEY ?? '' },
			},
		)

		if (!response.ok) throw new Error('Invalid response status')

		const data = await readJson<{ nfts: Nft[] }>(response)

		return data.nfts.filter(({ token_standard }) => token_standard !== 'erc20')
	} catch {
		return undefined
	}
}

export function findNft(nfts: Nft[], id: string): Nft | undefined {
	return nfts.find((nft) => `ethereum_${nft.contract}_${nft.identifier}` === id)
}

export async function getNft(id: string): Promise<Nft | undefined> {
	const nfts = await getNfts()

	if (!nfts) return undefined

	return findNft(nfts, id)
}
