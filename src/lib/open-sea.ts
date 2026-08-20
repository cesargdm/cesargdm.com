import { env } from 'cloudflare:workers'

import { cached, ONE_HOUR_SECONDS } from '@/lib/fetch-cache'
import { readJson } from '@/lib/json'
import { logIntegrationFailure } from '@/lib/log'

const DEFAULT_OWNER = '0xE3a856E4034D25FF68b3702B8f1618173BBFa130'

const AGENT_KEY_CACHE_KEY = 'opensea:agent-key'
/** Agent keys live 7 days; refresh a day early so one never expires mid-flight. */
const SIX_DAYS_SECONDS = 518400
const UNAUTHORIZED = 401

export type Nft = {
	name: string
	description: string
	image_url: string
	contract: string
	identifier: string
	token_standard: string
	metadata_url: string
}

/**
 * OpenSea issues short-lived, unauthenticated "agent" keys, which lets the NFT
 * card work with no configuration at all:
 * https://docs.opensea.io/reference/api-keys#instant-api-key-for-agents
 *
 * They expire after 7 days and key creation is itself rate limited, so the key
 * is cached in KV rather than minted per request. A permanent OPENSEA_API_KEY
 * always wins — the agent key is the fallback, and it carries a lower quota
 * (600 reads/hour) shared across every key on the account.
 */
async function getApiKey(): Promise<string | undefined> {
	if (env.OPENSEA_API_KEY) return env.OPENSEA_API_KEY

	const cachedKey = await env.CACHE?.get(AGENT_KEY_CACHE_KEY)
	if (cachedKey) return cachedKey

	const response = await fetch('https://api.opensea.io/api/v2/auth/keys', {
		method: 'POST',
	})

	if (!response.ok) {
		throw new Error(`OpenSea key creation responded ${response.status}`)
	}

	const { api_key: apiKey } = await readJson<{ api_key?: string }>(response)

	if (!apiKey) {
		throw new Error('OpenSea key creation returned no api_key')
	}

	await env.CACHE?.put(AGENT_KEY_CACHE_KEY, apiKey, {
		expirationTtl: SIX_DAYS_SECONDS,
	})

	return apiKey
}

export async function getNfts({
	chain = 'ethereum',
	owner = DEFAULT_OWNER,
} = {}): Promise<Nft[]> {
	try {
		const apiKey = await getApiKey()

		if (!apiKey) {
			throw new Error('no API key available')
		}

		const response = await fetch(
			`https://api.opensea.io/api/v2/chain/${chain}/account/${owner}/nfts`,
			{
				...cached(ONE_HOUR_SECONDS),
				headers: { 'X-API-KEY': apiKey },
			},
		)

		// A stale cached agent key reads as 401; drop it so the next call mints a
		// fresh one rather than failing until the TTL lapses.
		if (response.status === UNAUTHORIZED) {
			await env.CACHE?.delete(AGENT_KEY_CACHE_KEY)
			throw new Error('OpenSea rejected the API key')
		}

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
