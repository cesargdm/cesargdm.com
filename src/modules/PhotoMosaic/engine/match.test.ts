import { describe, expect, test } from 'bun:test'

import { srgbToOklab } from './color'
import {
	CHANNELS_PER_SAMPLE,
	SIGNATURE_CELLS,
	SIGNATURE_LENGTH,
} from './constants'
import { mulberry32 } from './layout'
import type { MatchInput } from './match'
import { assignTiles, assignTilesIterative, assignTilesLinear } from './match'

function flatSignature(l: number, a: number, b: number): Float32Array {
	const sig = new Float32Array(SIGNATURE_LENGTH)
	for (let sample = 0; sample < SIGNATURE_CELLS; sample++) {
		sig[sample * CHANNELS_PER_SAMPLE] = l
		sig[sample * CHANNELS_PER_SAMPLE + 1] = a
		sig[sample * CHANNELS_PER_SAMPLE + 2] = b
	}
	return sig
}

function randomSignature(random: () => number): Float32Array {
	const sig = new Float32Array(SIGNATURE_LENGTH)
	for (let sample = 0; sample < SIGNATURE_CELLS; sample++) {
		sig[sample * CHANNELS_PER_SAMPLE] = random()
		sig[sample * CHANNELS_PER_SAMPLE + 1] = random() * 0.6 - 0.3
		sig[sample * CHANNELS_PER_SAMPLE + 2] = random() * 0.6 - 0.3
	}
	return sig
}

function buildRandomSignatures(count: number, seed: number): Float32Array {
	const random = mulberry32(seed)
	const out = new Float32Array(count * SIGNATURE_LENGTH)
	for (let i = 0; i < count; i++) {
		out.set(randomSignature(random), i * SIGNATURE_LENGTH)
	}
	return out
}

describe('assignTiles', () => {
	test('an exact match wins over any other tile', () => {
		// Four maximally distinct flat colours: black, white, red, blue.
		const colors = [
			srgbToOklab(0, 0, 0),
			srgbToOklab(255, 255, 255),
			srgbToOklab(255, 0, 0),
			srgbToOklab(0, 0, 255),
		]
		const cellSignatures = new Float32Array(colors.length * SIGNATURE_LENGTH)
		const tileSignatures = new Float32Array(colors.length * SIGNATURE_LENGTH)
		for (const [index, color] of colors.entries()) {
			const sig = flatSignature(color.l, color.a, color.b)
			cellSignatures.set(sig, index * SIGNATURE_LENGTH)
			tileSignatures.set(sig, index * SIGNATURE_LENGTH)
		}

		const input: MatchInput = {
			cellSignatures,
			tileSignatures,
			cols: 2,
			rows: 2,
			tileCount: colors.length,
			spread: 4,
			weightC: 1,
			seed: 1,
		}

		const result = assignTiles(input)
		expect(Array.from(result.assignment)).toEqual([0, 1, 2, 3])
	})

	test('output length equals cols * rows and every cell is assigned a valid tile', () => {
		const cols = 5
		const rows = 5
		const tileCount = 6
		const input: MatchInput = {
			cellSignatures: buildRandomSignatures(cols * rows, 11),
			tileSignatures: buildRandomSignatures(tileCount, 22),
			cols,
			rows,
			tileCount,
			spread: 1.5,
			weightC: 1,
			seed: 42,
		}

		const result = assignTiles(input)
		expect(result.assignment.length).toBe(cols * rows)
		for (const tileIndex of result.assignment) {
			expect(tileIndex).toBeGreaterThanOrEqual(0)
			expect(tileIndex).toBeLessThan(tileCount)
		}
	})

	test('is deterministic for identical input', () => {
		const cols = 6
		const rows = 4
		const tileCount = 5
		const input: MatchInput = {
			cellSignatures: buildRandomSignatures(cols * rows, 5),
			tileSignatures: buildRandomSignatures(tileCount, 6),
			cols,
			rows,
			tileCount,
			spread: 1.5,
			weightC: 1,
			seed: 99,
		}

		const first = assignTiles(input)
		const second = assignTiles(input)
		expect(Array.from(first.assignment)).toEqual(Array.from(second.assignment))
		expect(first.distinctTiles).toBe(second.distinctTiles)
	})

	test('agrees with assignTilesLinear on the same input', () => {
		const cols = 8
		const rows = 6
		const tileCount = 10
		const input: MatchInput = {
			cellSignatures: buildRandomSignatures(cols * rows, 3),
			tileSignatures: buildRandomSignatures(tileCount, 4),
			cols,
			rows,
			tileCount,
			spread: 1.5,
			weightC: 1,
			seed: 7,
		}

		const viaIterative = assignTiles(input)
		const viaLinear = assignTilesLinear(input)
		expect(Array.from(viaIterative.assignment)).toEqual(
			Array.from(viaLinear.assignment),
		)
		expect(viaIterative.distinctTiles).toBe(viaLinear.distinctTiles)
	})

	test('assignTilesIterative drained manually yields non-decreasing progress and matches assignTiles', () => {
		const cols = 30
		const rows = 30
		const tileCount = 15
		const input: MatchInput = {
			cellSignatures: buildRandomSignatures(cols * rows, 111),
			tileSignatures: buildRandomSignatures(tileCount, 222),
			cols,
			rows,
			tileCount,
			spread: 1.5,
			weightC: 1,
			seed: 333,
		}

		const iterator = assignTilesIterative(input)
		let previousProgress = -1
		let step = iterator.next()
		while (!step.done) {
			expect(step.value).toBeGreaterThanOrEqual(previousProgress)
			previousProgress = step.value
			step = iterator.next()
		}

		const drained = step.value
		const expected = assignTiles(input)
		expect(Array.from(drained.assignment)).toEqual(
			Array.from(expected.assignment),
		)
		expect(drained.distinctTiles).toBe(expected.distinctTiles)
	})

	test('a single tile (tileCount = 1) completes and is assigned to every cell', () => {
		const cols = 10
		const rows = 10
		const input: MatchInput = {
			cellSignatures: buildRandomSignatures(cols * rows, 8),
			tileSignatures: buildRandomSignatures(1, 9),
			cols,
			rows,
			tileCount: 1,
			spread: 1.5,
			weightC: 1,
			seed: 1,
		}

		const result = assignTiles(input)
		expect(result.assignment.length).toBe(cols * rows)
		expect(Array.from(result.assignment).every((tile) => tile === 0)).toBe(true)
		expect(result.distinctTiles).toBe(1)
	})

	test('starvation: a spread far too small for the cell count still terminates and assigns every cell', () => {
		const cols = 25
		const rows = 20
		const tileCount = 50
		const input: MatchInput = {
			cellSignatures: buildRandomSignatures(cols * rows, 17),
			tileSignatures: buildRandomSignatures(tileCount, 18),
			cols,
			rows,
			tileCount,
			spread: 0.1,
			weightC: 1,
			seed: 19,
		}

		const result = assignTiles(input)
		expect(result.assignment.length).toBe(cols * rows)
		for (const tileIndex of result.assignment) {
			expect(tileIndex).toBeGreaterThanOrEqual(0)
			expect(tileIndex).toBeLessThan(tileCount)
		}
	}, 5000)

	test('distinctTiles is between 1 and tileCount inclusive', () => {
		const cols = 12
		const rows = 12
		const tileCount = 20
		const input: MatchInput = {
			cellSignatures: buildRandomSignatures(cols * rows, 55),
			tileSignatures: buildRandomSignatures(tileCount, 56),
			cols,
			rows,
			tileCount,
			spread: 1.5,
			weightC: 1,
			seed: 57,
		}

		const result = assignTiles(input)
		expect(result.distinctTiles).toBeGreaterThanOrEqual(1)
		expect(result.distinctTiles).toBeLessThanOrEqual(tileCount)
	})
})
