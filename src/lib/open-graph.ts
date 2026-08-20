// eslint-disable-next-line no-magic-numbers
type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export const styles = {
	container: {
		width: '100%',
		height: '100%',
		display: 'flex',
		backgroundColor: '#fff',
	},
	textContainer: {
		maxWidth: 630,
		width: '100%',
		margin: 'auto',
		display: 'flex',
		fontFamily: 'Inter',
		flexDirection: 'column',
	},
	heading: {
		opacity: 0.2,
		fontSize: 20,
		lineHeight: 0.8,
		marginBottom: 0,
		fontWeight: 600,
	},
	rightImage: {
		bottom: 0,
		right: 0,
		position: 'absolute',
	},
	nftImage: {
		bottom: 0,
		left: '50%',
		borderRadius: 50,
		position: 'absolute',
		transform: 'translate(-50%, 50px)',
	},
	extract: { fontSize: 32, opacity: 0.6 },
	title: {
		fontSize: 80,
		width: '100%',
		lineHeight: 0.85,
		fontWeight: 600,
	},
} as const

import avatarDataUri from '@/assets/avatar.png?inline'
import interRegular from '@/assets/fonts/inter-latin-400-normal.woff?inline'
import interSemiBold from '@/assets/fonts/inter-latin-600-normal.woff?inline'

export type OgFont = {
	name: string
	weight: FontWeight
	style: 'normal'
	data: ArrayBuffer
}

function decodeDataUri(dataUri: string): ArrayBuffer {
	const base64 = dataUri.slice(dataUri.indexOf(',') + 1)
	const binary = atob(base64)
	const bytes = new Uint8Array(binary.length)

	for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)

	return bytes.buffer
}

let cachedFonts: OgFont[] | undefined

/**
 * Fonts are bundled, not fetched. Loading them from Google Fonts cost two
 * network round-trips on every OG render, and the previous source
 * (rsms.me/inter/font-files) started returning 404 — which made satori receive
 * an HTML error page as font data and emit an empty image.
 */
export function getFonts(): OgFont[] {
	cachedFonts ??= [
		{
			name: 'Inter',
			weight: 400,
			style: 'normal',
			data: decodeDataUri(interRegular),
		},
		{
			name: 'Inter',
			weight: 600,
			style: 'normal',
			data: decodeDataUri(interSemiBold),
		},
	]

	return cachedFonts
}

/**
 * The avatar is bundled too. It used to be fetched from the production origin,
 * so previews and local builds rendered by pulling an asset off the live site.
 */
export function getAvatarDataUri() {
	return avatarDataUri
}

/**
 * Inlines a genuinely remote image (e.g. an NFT artwork) — workers-og does not
 * fetch images itself.
 */
export async function fetchImageAsDataUri(url: string) {
	try {
		const response = await fetch(url)
		const contentType = response.headers.get('content-type') ?? 'image/png'
		const bytes = new Uint8Array(await response.arrayBuffer())
		let binary = ''
		for (const byte of bytes) binary += String.fromCharCode(byte)

		return `data:${contentType};base64,${btoa(binary)}`
	} catch {
		return undefined
	}
}

export const OG_SIZE = { width: 1200, height: 630 }

export function ogResponse(image: Response) {
	image.headers.set('cache-control', 'public, max-age=3600, s-maxage=86400')
	return image
}
