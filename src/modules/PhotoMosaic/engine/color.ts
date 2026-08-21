/**
 * Colour maths for the mosaic matcher.
 *
 * Pure: no canvas, no DOM, no worker globals. That is what makes it testable
 * with `bun test`, which has no DOM environment.
 */

import {
	CHANNELS_PER_SAMPLE,
	SIGNATURE_CELLS,
	SIGNATURE_GRID,
	WEIGHT_L,
} from './constants'

export type Oklab = { l: number; a: number; b: number }

function buildSrgbToLinearLut(): Float32Array {
	const lut = new Float32Array(256)
	for (let value = 0; value < 256; value++) {
		const c = value / 255
		lut[value] = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
	}
	return lut
}

const SRGB_TO_LINEAR_LUT = buildSrgbToLinearLut()

/**
 * One 8-bit sRGB channel to linear light, 0..1.
 *
 * Averaging must happen in linear light. The mean of sRGB 0 and 255 is 128,
 * which is ~22% linear luminance rather than 50% — averaging gamma-encoded
 * values makes every tile signature darker than the tile actually is, and the
 * whole mosaic then sits visibly darker than the source.
 */
export function srgbToLinear(channel: number): number {
	return SRGB_TO_LINEAR_LUT[channel]
}

/** Linear-light RGB (0..1 each) to OKLab. */
export function linearRgbToOklab(r: number, g: number, b: number): Oklab {
	const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
	const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
	const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

	const lRoot = Math.cbrt(l)
	const mRoot = Math.cbrt(m)
	const sRoot = Math.cbrt(s)

	return {
		l: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
		a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
		b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
	}
}

/** 8-bit sRGB straight to OKLab, for one-off conversions. */
export function srgbToOklab(r: number, g: number, b: number): Oklab {
	return linearRgbToOklab(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b))
}

/**
 * Block-averages an RGBA buffer of `sourcePx` x `sourcePx` into a
 * SIGNATURE_LENGTH OKLab signature, written into `out` at `offset`.
 *
 * A single average colour is degenerate: half-black/half-white has the same mean
 * as flat grey, so every edge in the source would dissolve. The 3x3 signature
 * lets an edge cell pick a tile with an edge in the same place.
 */
export function writeSignature(
	rgba: Uint8ClampedArray,
	sourcePx: number,
	out: Float32Array,
	offset: number,
): void {
	const blockSize = sourcePx / SIGNATURE_GRID
	const pixelsPerBlock = blockSize * blockSize
	const channelsPerPixel = 4

	for (let blockY = 0; blockY < SIGNATURE_GRID; blockY++) {
		for (let blockX = 0; blockX < SIGNATURE_GRID; blockX++) {
			let rSum = 0
			let gSum = 0
			let bSum = 0

			for (let dy = 0; dy < blockSize; dy++) {
				const y = blockY * blockSize + dy
				for (let dx = 0; dx < blockSize; dx++) {
					const x = blockX * blockSize + dx
					const pixelIndex = (y * sourcePx + x) * channelsPerPixel
					rSum += SRGB_TO_LINEAR_LUT[rgba[pixelIndex]]
					gSum += SRGB_TO_LINEAR_LUT[rgba[pixelIndex + 1]]
					bSum += SRGB_TO_LINEAR_LUT[rgba[pixelIndex + 2]]
				}
			}

			const oklab = linearRgbToOklab(
				rSum / pixelsPerBlock,
				gSum / pixelsPerBlock,
				bSum / pixelsPerBlock,
			)
			const blockIndex = blockY * SIGNATURE_GRID + blockX
			const sampleOffset = offset + blockIndex * CHANNELS_PER_SAMPLE
			out[sampleOffset] = oklab.l
			out[sampleOffset + 1] = oklab.a
			out[sampleOffset + 2] = oklab.b
		}
	}
}

/** Per-sample weights for the 3x3 signature: corners, edges, centre. */
const SAMPLE_WEIGHTS = new Float32Array([
	0.75, 1, 0.75, 1, 1.5, 1, 0.75, 1, 0.75,
])
const SAMPLE_WEIGHT_SUM = SAMPLE_WEIGHTS.reduce(
	(sum, weight) => sum + weight,
	0,
)

/**
 * Weighted squared OKLab distance between two signatures.
 *
 * `weightC` is 0 in black-and-white mode: the render discards chroma, so
 * matching on it would be noise.
 */
export function signatureDistanceSq(
	a: Float32Array,
	aOffset: number,
	b: Float32Array,
	bOffset: number,
	weightC: number,
): number {
	let sum = 0

	for (let sample = 0; sample < SIGNATURE_CELLS; sample++) {
		const base = sample * CHANNELS_PER_SAMPLE
		const dl = a[aOffset + base] - b[bOffset + base]
		const da = a[aOffset + base + 1] - b[bOffset + base + 1]
		const db = a[aOffset + base + 2] - b[bOffset + base + 2]

		sum +=
			SAMPLE_WEIGHTS[sample] *
			(WEIGHT_L * dl * dl + weightC * (da * da + db * db))
	}

	return sum / SAMPLE_WEIGHT_SUM
}

/**
 * Mean OKLab of a signature, written into `out` at `offset` as (l, a, b).
 *
 * Used by the bucketed pre-filter. By Jensen's inequality the distance between
 * two means is a lower bound on the mean of the per-sample distances, which is
 * what makes the pre-filter's pruning admissible rather than heuristic.
 */
export function writeSignatureMean(
	signatures: Float32Array,
	offset: number,
	out: Float32Array,
	outOffset: number,
): void {
	let lSum = 0
	let aSum = 0
	let bSum = 0

	for (let sample = 0; sample < SIGNATURE_CELLS; sample++) {
		const base = offset + sample * CHANNELS_PER_SAMPLE
		lSum += signatures[base]
		aSum += signatures[base + 1]
		bSum += signatures[base + 2]
	}

	out[outOffset] = lSum / SIGNATURE_CELLS
	out[outOffset + 1] = aSum / SIGNATURE_CELLS
	out[outOffset + 2] = bSum / SIGNATURE_CELLS
}

/** `rgb(r, g, b)` for a canvas fillStyle. */
export function toCssRgb(r: number, g: number, b: number): string {
	return `rgb(${r}, ${g}, ${b})`
}
