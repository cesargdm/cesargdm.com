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

import { loadGoogleFont } from 'workers-og'

export type OgFont = {
	name: string
	weight: FontWeight
	style: 'normal'
	data: ArrayBuffer
}

/**
 * Loads the Inter font (400 + 600) via Google Fonts. `loadGoogleFont` returns an
 * ArrayBuffer that `workers-og` can embed on the Workers runtime.
 */
export async function getFonts(): Promise<OgFont[]> {
	const [regular, bold] = await Promise.all([
		loadGoogleFont({ family: 'Inter', weight: 400 }),
		loadGoogleFont({ family: 'Inter', weight: 600 }),
	])

	return [
		{ name: 'Inter', weight: 400, style: 'normal', data: regular },
		{ name: 'Inter', weight: 600, style: 'normal', data: bold },
	]
}

/** Fetch a remote image and inline it as a data URI (workers-og does not fetch). */
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
