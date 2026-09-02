/**
 * WCAG contrast helpers for surfaces that opt out of the theme.
 *
 * A card whose background comes from content (a project's brand colour) keeps
 * that colour in both themes, so its foreground cannot inherit the theme ink —
 * the two sides of the pair would move independently and collide.
 */

/** Same values as the light/dark theme `text.regular` tokens. */
const INK_DARK = '#111318'
const INK_LIGHT = '#F5F7FA'

const SHORT_HEX_LENGTH = 3
const LONG_HEX_LENGTH = 6

function parseHex(color: string): [number, number, number] | null {
	const hex = color.trim().replace(/^#/, '')

	const expanded =
		hex.length === SHORT_HEX_LENGTH
			? hex
					.split('')
					.map((char) => char + char)
					.join('')
			: hex

	if (expanded.length !== LONG_HEX_LENGTH || !/^[0-9a-f]{6}$/i.test(expanded)) {
		return null
	}

	return [
		Number.parseInt(expanded.slice(0, 2), 16),
		Number.parseInt(expanded.slice(2, 4), 16),
		Number.parseInt(expanded.slice(4, 6), 16),
	]
}

function channelToLinear(channel: number): number {
	const c = channel / 255
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.1 relative luminance, 0 (black) to 1 (white). */
export function getRelativeLuminance(color: string): number | null {
	const rgb = parseHex(color)
	if (!rgb) return null

	const [r, g, b] = rgb.map(channelToLinear)

	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * The theme ink that reads best on `background`.
 *
 * Returns `undefined` when the colour cannot be parsed, so the caller leaves
 * the inherited theme ink in place rather than guessing.
 */
export function getContrastingInk(background: string): string | undefined {
	const luminance = getRelativeLuminance(background)
	if (luminance === null) return undefined

	// Contrast against white is (1.05 / (L + 0.05)); against black it is
	// ((L + 0.05) / 0.05). They cross at L ≈ 0.179.
	return luminance > 0.179 ? INK_DARK : INK_LIGHT
}
