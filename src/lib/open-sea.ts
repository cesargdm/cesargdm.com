import { env } from 'cloudflare:workers'

import { cached, ONE_HOUR_SECONDS } from '@/lib/fetch-cache'
import { readJson } from '@/lib/json'
import { logIntegrationFailure } from '@/lib/log'

const DEFAULT_OWNER = '0xE3a856E4034D25FF68b3702B8f1618173BBFa130'

export type Nft = {
	name: string
	description: string
	image_url: string
	contract: string
	identifier: string
	token_standard: string
	metadata_url: string
}

export async function getNfts({
	chain = 'ethereum',
	owner = DEFAULT_OWNER,
} = {}): Promise<Nft[]> {
	// OpenSea answers 401 without a key, which previously surfaced as an empty
	// list — indistinguishable from an account that owns nothing.
	if (!env.OPENSEA_API_KEY) {
		logIntegrationFailure('opensea', 'OPENSEA_API_KEY is not set')
		return []
	}

	try {
		const response = await fetch(
			`https://api.opensea.io/api/v2/chain/${chain}/account/${owner}/nfts`,
			{
				...cached(ONE_HOUR_SECONDS),
				headers: { 'X-API-KEY': env.OPENSEA_API_KEY },
			},
		)

		if (!response.ok) {
			throw new Error(`OpenSea responded ${response.status}`)
		}

		const data = await readJson<{ nfts?: Nft[] }>(response)

		return (data.nfts ?? []).filter(
			({ token_standard }) => token_standard !== 'erc20',
		)
	} catch (error) {
		logIntegrationFailure('opensea', error)
		return []
	}
}

export function findNft(nfts: Nft[], id: string): Nft | undefined {
	return nfts.find((nft) => `ethereum_${nft.contract}_${nft.identifier}` === id)
}

export async function getNft(id: string): Promise<Nft | undefined> {
	return findNft(await getNfts(), id)
}
