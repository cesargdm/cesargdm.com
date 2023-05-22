import type { FontWeight } from 'next/dist/compiled/@vercel/og/satori'

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
		fontWeight: '600',
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
		fontWeight: '600',
	},
} as const

export function fetchFont(name: string, weight: FontWeight, url: string) {
	return fetch(url)
		.then((res) => res.arrayBuffer())
		.then((arrayBuffer) => ({
			name,
			weight,
			data: arrayBuffer,
		}))
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
		{
			weight: 400,
			url: 'https://rsms.me/inter/font-files/Inter-Regular.woff',
		},
		{
			weight: 600,
			url: 'https://rsms.me/inter/font-files/Inter-Black.woff',
		},
	])
