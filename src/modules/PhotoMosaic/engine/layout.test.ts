import { describe, expect, test } from 'bun:test'

import {
	DEFAULT_COLUMNS,
	MAX_CELLS,
	MAX_COLUMNS,
	MIN_COLUMNS,
} from './constants'
import {
	coverFactor,
	coverSide,
	deriveGrid,
	mulberry32,
	shuffledOrder,
} from './layout'

function closeTo(actual: number, expected: number, tolerance: number): void {
	expect(Math.abs(actual - expected)).toBeLessThan(tolerance)
}

describe('coverFactor', () => {
	test('0 → 1', () => {
		closeTo(coverFactor(0), 1, 1e-9)
	})

	test('π/2 → 1', () => {
		closeTo(coverFactor(Math.PI / 2), 1, 1e-9)
	})

	test('π/4 → √2', () => {
		closeTo(coverFactor(Math.PI / 4), Math.SQRT2, 1e-5)
	})

	test('π/6 → ≈1.36603', () => {
		closeTo(coverFactor(Math.PI / 6), 1.36603, 1e-5)
	})

	test('is always ≥ 1 across a sweep of angles', () => {
		for (let step = -200; step <= 200; step++) {
			const theta = (step / 200) * Math.PI * 2
			expect(coverFactor(theta)).toBeGreaterThanOrEqual(1 - 1e-9)
		}
	})

	test('is symmetric in sign', () => {
		for (const theta of [0.1, 0.3, 0.7, 1.2, 2.5, 3.9]) {
			closeTo(coverFactor(theta), coverFactor(-theta), 1e-9)
		}
	})
})

describe('coverSide', () => {
	test('for a square cell, equals cellPx * coverFactor(theta)', () => {
		const cellPx = 96
		for (const theta of [0, Math.PI / 6, Math.PI / 4, Math.PI / 3, 1.1]) {
			closeTo(
				coverSide(cellPx, cellPx, theta),
				cellPx * coverFactor(theta),
				1e-6,
			)
		}
	})

	test('for a 2:1 cell at π/4, never under-covers the short-edge formula', () => {
		const width = 96
		const height = 48
		const theta = Math.PI / 4
		const shortEdgeFormula = height * coverFactor(theta)
		expect(coverSide(width, height, theta)).toBeGreaterThanOrEqual(
			shortEdgeFormula,
		)
	})

	test('the rotated square geometrically contains all four cell corners', () => {
		const cellSizes: Array<[number, number]> = [
			[40, 40],
			[80, 40],
			[40, 80],
			[120, 30],
			[30, 120],
			[96, 96],
		]

		for (const [width, height] of cellSizes) {
			for (let degrees = -85; degrees <= 85; degrees += 5) {
				const theta = (degrees * Math.PI) / 180
				const side = coverSide(width, height, theta)
				const cos = Math.cos(theta)
				const sin = Math.sin(theta)

				for (const sx of [-1, 1]) {
					for (const sy of [-1, 1]) {
						const x = (sx * width) / 2
						const y = (sy * height) / 2
						// Rotate the corner by -theta into the tile's own frame.
						const rotatedX = x * cos + y * sin
						const rotatedY = -x * sin + y * cos

						expect(Math.abs(rotatedX)).toBeLessThanOrEqual(side / 2 + 1e-9)
						expect(Math.abs(rotatedY)).toBeLessThanOrEqual(side / 2 + 1e-9)
					}
				}
			}
		}
	})
})

describe('deriveGrid', () => {
	test('preserves aspect ratio approximately', () => {
		const grid = deriveGrid(1920, 1080, DEFAULT_COLUMNS, 1200)
		closeTo(grid.rows / grid.cols, 1080 / 1920, 0.05)
	})

	test('width and height land exactly on integer cell boundaries', () => {
		const grids = [
			deriveGrid(1920, 1080, DEFAULT_COLUMNS, 1200),
			deriveGrid(1000, 3000, 40, 2048),
			deriveGrid(4000, 3000, 120, 900),
		]
		for (const grid of grids) {
			expect(grid.width).toBe(grid.cols * grid.cellPx)
			expect(grid.height).toBe(grid.rows * grid.cellPx)
		}
	})

	test('cellPx is always at least 1, even for a tiny target', () => {
		const grid = deriveGrid(1920, 1080, DEFAULT_COLUMNS, 1)
		expect(grid.cellPx).toBeGreaterThanOrEqual(1)
	})

	test('clamps columns below MIN_COLUMNS up to MIN_COLUMNS', () => {
		const grid = deriveGrid(1000, 1000, 3, 1200)
		expect(grid.cols).toBe(MIN_COLUMNS)
	})

	test('clamps columns above MAX_COLUMNS down to MAX_COLUMNS', () => {
		const grid = deriveGrid(1000, 1000, 500, 1200)
		expect(grid.cols).toBe(MAX_COLUMNS)
	})

	test('an extreme 1:10 panorama at max columns stays within MAX_CELLS', () => {
		const grid = deriveGrid(1000, 10_000, MAX_COLUMNS, 1200)
		expect(grid.cols * grid.rows).toBeLessThanOrEqual(MAX_CELLS)
	})
})

describe('mulberry32', () => {
	function take(random: () => number, count: number): number[] {
		return Array.from({ length: count }, () => random())
	}

	test('the same seed produces an identical sequence', () => {
		const first = take(mulberry32(12_345), 20)
		const second = take(mulberry32(12_345), 20)
		expect(first).toEqual(second)
	})

	test('different seeds produce different sequences', () => {
		const first = take(mulberry32(1), 20)
		const second = take(mulberry32(2), 20)
		expect(first).not.toEqual(second)
	})

	test('all values fall in [0, 1)', () => {
		const random = mulberry32(999)
		for (let i = 0; i < 1000; i++) {
			const value = random()
			expect(value).toBeGreaterThanOrEqual(0)
			expect(value).toBeLessThan(1)
		}
	})
})

describe('shuffledOrder', () => {
	test('has length n', () => {
		expect(shuffledOrder(50, 7).length).toBe(50)
	})

	test('is a true permutation of 0..n-1', () => {
		const count = 200
		const order = Array.from(shuffledOrder(count, 7))
		const sorted = [...order].sort((a, b) => a - b)
		expect(sorted).toEqual(Array.from({ length: count }, (_, i) => i))
	})

	test('is deterministic for a given seed', () => {
		expect(Array.from(shuffledOrder(30, 42))).toEqual(
			Array.from(shuffledOrder(30, 42)),
		)
	})

	test('differs between seeds', () => {
		expect(Array.from(shuffledOrder(30, 1))).not.toEqual(
			Array.from(shuffledOrder(30, 2)),
		)
	})

	test('handles n = 0', () => {
		expect(shuffledOrder(0, 1).length).toBe(0)
	})

	test('handles n = 1', () => {
		expect(Array.from(shuffledOrder(1, 1))).toEqual([0])
	})

	test('caps cells even when cols bottoms out at MIN_COLUMNS', () => {
		// A 1:2048 sliver: reducing cols alone reaches the floor while rows is
		// still in the tens of thousands.
		for (const ratio of [512, 1024, 2048, 8192]) {
			const grid = deriveGrid(1, ratio, MAX_COLUMNS, 1200)
			expect(grid.cols * grid.rows).toBeLessThanOrEqual(MAX_CELLS)
			expect(grid.rows).toBeGreaterThanOrEqual(1)
			expect(grid.width).toBe(grid.cols * grid.cellPx)
			expect(grid.height).toBe(grid.rows * grid.cellPx)
		}

		// And the mirrored case, a very wide panorama.
		for (const ratio of [512, 2048]) {
			const grid = deriveGrid(ratio, 1, MAX_COLUMNS, 1200)
			expect(grid.cols * grid.rows).toBeLessThanOrEqual(MAX_CELLS)
		}
	})
})
