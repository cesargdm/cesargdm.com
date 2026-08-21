import { describe, expect, test } from 'bun:test'

import {
	signatureDistanceSq,
	srgbToLinear,
	srgbToOklab,
	toCssRgb,
	writeSignature,
} from './color'
import {
	CHANNELS_PER_SAMPLE,
	SIGNATURE_CELLS,
	SIGNATURE_SOURCE_PX,
} from './constants'

function closeTo(actual: number, expected: number, tolerance: number): void {
	expect(Math.abs(actual - expected)).toBeLessThan(tolerance)
}

describe('srgbToLinear', () => {
	test('0 maps to 0', () => {
		expect(srgbToLinear(0)).toBe(0)
	})

	test('255 maps to 1', () => {
		expect(srgbToLinear(255)).toBe(1)
	})

	test('the sRGB midpoint is NOT 0.5 linear (the gamma trap)', () => {
		closeTo(srgbToLinear(128), 0.2159, 1e-3)
	})

	test('is monotonically increasing', () => {
		for (let channel = 1; channel < 256; channel++) {
			expect(srgbToLinear(channel)).toBeGreaterThan(srgbToLinear(channel - 1))
		}
	})
})

describe('srgbToOklab', () => {
	test('white is L≈1, a≈0, b≈0', () => {
		const oklab = srgbToOklab(255, 255, 255)
		closeTo(oklab.l, 1, 1e-3)
		closeTo(oklab.a, 0, 1e-3)
		closeTo(oklab.b, 0, 1e-3)
	})

	test('black is all ≈0', () => {
		const oklab = srgbToOklab(0, 0, 0)
		closeTo(oklab.l, 0, 1e-3)
		closeTo(oklab.a, 0, 1e-3)
		closeTo(oklab.b, 0, 1e-3)
	})

	test('red matches the published OKLab reference', () => {
		const oklab = srgbToOklab(255, 0, 0)
		closeTo(oklab.l, 0.6279, 1e-3)
		closeTo(oklab.a, 0.2249, 1e-3)
		closeTo(oklab.b, 0.1258, 1e-3)
	})

	test('green matches the published OKLab reference L', () => {
		const oklab = srgbToOklab(0, 255, 0)
		closeTo(oklab.l, 0.8664, 1e-3)
	})

	test('blue matches the published OKLab reference L', () => {
		const oklab = srgbToOklab(0, 0, 255)
		closeTo(oklab.l, 0.452, 1e-3)
	})
})

function makeRgba(sourcePx: number, pixel: (x: number, y: number) => number) {
	const rgba = new Uint8ClampedArray(sourcePx * sourcePx * 4)
	for (let y = 0; y < sourcePx; y++) {
		for (let x = 0; x < sourcePx; x++) {
			const value = pixel(x, y)
			const index = (y * sourcePx + x) * 4
			rgba[index] = value
			rgba[index + 1] = value
			rgba[index + 2] = value
			rgba[index + 3] = 255
		}
	}
	return rgba
}

describe('writeSignature', () => {
	test('a uniform mid-grey image gives 9 identical samples matching srgbToOklab', () => {
		const rgba = makeRgba(SIGNATURE_SOURCE_PX, () => 128)
		const out = new Float32Array(SIGNATURE_CELLS * CHANNELS_PER_SAMPLE)
		writeSignature(rgba, SIGNATURE_SOURCE_PX, out, 0)

		const expected = srgbToOklab(128, 128, 128)
		for (let sample = 0; sample < SIGNATURE_CELLS; sample++) {
			const base = sample * CHANNELS_PER_SAMPLE
			closeTo(out[base], expected.l, 1e-4)
			closeTo(out[base + 1], expected.a, 1e-4)
			closeTo(out[base + 2], expected.b, 1e-4)
		}
	})

	test('a left-black / right-white image keeps the edge: left column differs from right column', () => {
		const half = SIGNATURE_SOURCE_PX / 2
		const rgba = makeRgba(SIGNATURE_SOURCE_PX, (x) => (x < half ? 0 : 255))
		const out = new Float32Array(SIGNATURE_CELLS * CHANNELS_PER_SAMPLE)
		writeSignature(rgba, SIGNATURE_SOURCE_PX, out, 0)

		// Sample grid is row-major 3x3: index 0 is top-left (left column),
		// index 2 is top-right (right column).
		const leftL = out[0 * CHANNELS_PER_SAMPLE]
		const rightL = out[2 * CHANNELS_PER_SAMPLE]
		expect(Math.abs(leftL - rightL)).toBeGreaterThan(0.5)
	})

	test('averaging happens in linear light, not gamma space', () => {
		// Each 4x4 block is an exact checkerboard of black/white pixels, so the
		// correct block average is linear-light 0.5 (sRGB ~188), not the mean of
		// the sRGB byte values (~128).
		const rgba = makeRgba(SIGNATURE_SOURCE_PX, (x, y) =>
			(x + y) % 2 === 0 ? 0 : 255,
		)
		const out = new Float32Array(SIGNATURE_CELLS * CHANNELS_PER_SAMPLE)
		writeSignature(rgba, SIGNATURE_SOURCE_PX, out, 0)

		const linearAverageL = srgbToOklab(188, 188, 188).l
		const gammaAverageL = srgbToOklab(128, 128, 128).l
		const blockL = out[0]

		closeTo(blockL, linearAverageL, 0.02)
		expect(blockL).toBeGreaterThan(gammaAverageL + 0.1)
	})
})

describe('signatureDistanceSq', () => {
	function flatSignature(l: number, a: number, b: number): Float32Array {
		const sig = new Float32Array(SIGNATURE_CELLS * CHANNELS_PER_SAMPLE)
		for (let sample = 0; sample < SIGNATURE_CELLS; sample++) {
			sig[sample * CHANNELS_PER_SAMPLE] = l
			sig[sample * CHANNELS_PER_SAMPLE + 1] = a
			sig[sample * CHANNELS_PER_SAMPLE + 2] = b
		}
		return sig
	}

	test('is zero for two identical signatures', () => {
		const sig = flatSignature(0.5, 0.1, -0.05)
		expect(signatureDistanceSq(sig, 0, sig, 0, 1)).toBe(0)
	})

	test('is symmetric', () => {
		const a = flatSignature(0.5, 0.1, -0.05)
		const b = flatSignature(0.3, -0.2, 0.15)
		closeTo(
			signatureDistanceSq(a, 0, b, 0, 1),
			signatureDistanceSq(b, 0, a, 0, 1),
			1e-9,
		)
	})

	test('is larger for a more different pair than a less different pair', () => {
		const base = flatSignature(0.5, 0, 0)
		const near = flatSignature(0.51, 0, 0)
		const far = flatSignature(0.9, 0, 0)

		const nearDistance = signatureDistanceSq(base, 0, near, 0, 1)
		const farDistance = signatureDistanceSq(base, 0, far, 0, 1)
		expect(farDistance).toBeGreaterThan(nearDistance)
	})

	test('with weightC = 0, signatures differing only in a/b are ~0 apart', () => {
		const a = flatSignature(0.5, 0.1, -0.2)
		const b = flatSignature(0.5, 0.9, 0.7)
		closeTo(signatureDistanceSq(a, 0, b, 0, 0), 0, 1e-9)
	})
})

describe('toCssRgb', () => {
	test('returns a canvas-friendly rgb() string', () => {
		expect(toCssRgb(1, 2, 3)).toBe('rgb(1, 2, 3)')
	})
})
