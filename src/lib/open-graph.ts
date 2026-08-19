import fs from 'node:fs'
import path from 'node:path'

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

/**
 * Fonts are vendored from @fontsource/inter and read from disk. They used to be
 * fetched from rsms.me/inter/font-files, which now 404s — satori then received
 * an HTML error page as font data and every OG image rendered as an empty 200.
 */
/* eslint-disable no-magic-numbers -- CSS font weights */
const FONT_FILES = [
	{ weight: 400 as const, file: 'inter-latin-400-normal.woff' },
	{ weight: 600 as const, file: 'inter-latin-600-normal.woff' },
]
/* eslint-enable no-magic-numbers */

const fontsDirectory = path.join(process.cwd(), './src/assets/fonts')

function readFonts() {
	return FONT_FILES.map(({ weight, file }) => {
		const buffer = fs.readFileSync(path.join(fontsDirectory, file))

		return {
			name: 'Inter',
			weight,
			data: buffer.buffer.slice(
				buffer.byteOffset,
				buffer.byteOffset + buffer.byteLength,
			),
		}
	})
}

// Read once per process; the files never change at runtime.
let cachedFonts: ReturnType<typeof readFonts> | undefined

export function getDefaultFonts() {
	cachedFonts ??= readFonts()

	return cachedFonts
}

/**
 * Inlined rather than referenced by URL: satori fetches remote images, and the
 * only absolute URL available is production — so previews and local builds
 * rendered by pulling an asset from the live site.
 */
let cachedAvatar: string | undefined

export function getAvatarDataUri() {
	cachedAvatar ??= `data:image/png;base64,${fs
		.readFileSync(
			path.join(process.cwd(), './public/android-chrome-512x512.png'),
		)
		.toString('base64')}`

	return cachedAvatar
}
