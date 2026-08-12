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

export type OgFont = {
	name: string
	weight: FontWeight
	style: 'normal'
	data: ArrayBuffer
}

export function fetchFont(
	name: string,
	weight: FontWeight,
	url: string,
): Promise<OgFont> {
	return fetch(url)
		.then((res) => res.arrayBuffer())
		.then((data) => ({ name, weight, style: 'normal' as const, data }))
}

export function fetchFonts(
	name: string,
	weights: { url: string; weight: FontWeight }[],
) {
	return Promise.all(
		weights.map((weight) => fetchFont(name, weight.weight, weight.url)),
	)
}

export const getDefaultFonts = () =>
	fetchFonts('Inter', [
		{ weight: 400, url: 'https://rsms.me/inter/font-files/Inter-Regular.woff' },
		{ weight: 600, url: 'https://rsms.me/inter/font-files/Inter-Black.woff' },
	])

/** Fetch a remote image and inline it as a data URI (satori does not fetch). */
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
	const headers = new Headers(image.headers)
	headers.set('content-type', 'image/png')
	headers.set('cache-control', 'public, max-age=3600, s-maxage=86400')
	return new Response(image.body, { status: image.status, headers })
}
