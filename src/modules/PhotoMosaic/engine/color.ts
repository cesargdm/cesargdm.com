/* eslint-disable no-magic-numbers -- The sRGB transfer function and the OKLab
   matrices are published constants; naming each of ~30 coefficients would be
   noise, and the rule flags literals inside array literals and expressions even
   when they are assigned to a named const. */

/**
 * Colour maths for the mosaic matcher.
 *
 * Pure: no canvas, no DOM, no worker globals. That is what makes it testable
 * with `bun test`, which has no DOM environment.
 */

export type Oklab = { l: number; a: number; b: number }

/**
 * One 8-bit sRGB channel to linear light, 0..1.
 *
 * Averaging must happen in linear light. The mean of sRGB 0 and 255 is 128,
 * which is ~22% linear luminance rather than 50% — averaging gamma-encoded
 * values makes every tile signature darker than the tile actually is, and the
 * whole mosaic then sits visibly darker than the source.
 */
export function srgbToLinear(channel: number): number {
	throw new Error('unimplemented')
}

/** Linear-light RGB (0..1 each) to OKLab. */
export function linearRgbToOklab(r: number, g: number, b: number): Oklab {
	throw new Error('unimplemented')
}

/** 8-bit sRGB straight to OKLab, for one-off conversions. */
export function srgbToOklab(r: number, g: number, b: number): Oklab {
	throw new Error('unimplemented')
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
	throw new Error('unimplemented')
}

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
	throw new Error('unimplemented')
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
	throw new Error('unimplemented')
}

/** `rgb(r, g, b)` for a canvas fillStyle. */
export function toCssRgb(r: number, g: number, b: number): string {
	throw new Error('unimplemented')
}
