import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'

export const prerender = false

// 3 days
const REVALIDATE = 259200
const MS_PER_SECOND = 1000
const HEX_RADIX = 16

const API_URL = 'https://api.twitter.com/2/users/me'
const QUERY =
	'user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,withheld&expansions=pinned_tweet_id'

function percentEncode(value: string) {
	return encodeURIComponent(value).replace(
		/[!*'()]/g,
		(char) => `%${char.charCodeAt(0).toString(HEX_RADIX).toUpperCase()}`,
	)
}

async function hmacSha1Base64(key: string, base: string) {
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(key),
		{ name: 'HMAC', hash: 'SHA-1' },
		false,
		['sign'],
	)

	const signature = await crypto.subtle.sign(
		'HMAC',
		cryptoKey,
		new TextEncoder().encode(base),
	)

	let binary = ''
	for (const byte of new Uint8Array(signature)) {
		binary += String.fromCharCode(byte)
	}

	return btoa(binary)
}

export const GET: APIRoute = async () => {
	try {
		const {
			X_API_KEY,
			X_API_KEY_SECRET,
			X_ACCESS_TOKEN,
			X_ACCESS_TOKEN_SECRET,
		} = env

		if (
			!X_API_KEY ||
			!X_API_KEY_SECRET ||
			!X_ACCESS_TOKEN ||
			!X_ACCESS_TOKEN_SECRET
		) {
			throw new Error('Missing X credentials')
		}

		const oauthParams: Record<string, string> = {
			oauth_consumer_key: X_API_KEY,
			oauth_nonce: crypto.randomUUID().replace(/-/g, ''),
			oauth_signature_method: 'HMAC-SHA1',
			oauth_timestamp: Math.floor(Date.now() / MS_PER_SECOND).toString(),
			oauth_token: X_ACCESS_TOKEN,
			oauth_version: '1.0',
		}

		const queryParams: Record<string, string> = {}
		new URLSearchParams(QUERY).forEach((value, key) => {
			queryParams[key] = value
		})

		const allParams = { ...oauthParams, ...queryParams }
		const paramString = Object.keys(allParams)
			.sort()
			.map((key) => `${percentEncode(key)}=${percentEncode(allParams[key])}`)
			.join('&')

		const baseString = `GET&${percentEncode(API_URL)}&${percentEncode(paramString)}`
		const signingKey = `${percentEncode(X_API_KEY_SECRET)}&${percentEncode(X_ACCESS_TOKEN_SECRET)}`
		const signature = await hmacSha1Base64(signingKey, baseString)

		const authParams: Record<string, string> = {
			...oauthParams,
			oauth_signature: signature,
		}
		const authHeader = `OAuth ${Object.keys(authParams)
			.sort()
			.map((key) => `${percentEncode(key)}="${percentEncode(authParams[key])}"`)
			.join(', ')}`

		const response = await fetch(`${API_URL}?${QUERY}`, {
			headers: { Authorization: authHeader },
		})

		if (!response.ok) {
			throw new Error(`X API responded with ${response.status}`)
		}

		const data = await response.json()

		return new Response(JSON.stringify(data), {
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'cache-control': `public, s-maxage=${REVALIDATE}, stale-while-revalidate`,
			},
		})
	} catch {
		return new Response(JSON.stringify({ message: 'Error' }), {
			status: 500,
			headers: { 'content-type': 'application/json; charset=utf-8' },
		})
	}
}
