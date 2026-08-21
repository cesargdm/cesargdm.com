/**
 * Grid geometry and deterministic randomness.
 *
 * Pure: no canvas, no DOM, no worker globals.
 */

import { MAX_CELLS, MAX_COLUMNS, MIN_COLUMNS } from './constants'

export type Grid = {
	cols: number
	rows: number
	/** Output pixels per cell, an integer so cells tile the canvas exactly. */
	cellPx: number
	/** `cols * cellPx`. */
	width: number
	/** `rows * cellPx`. */
	height: number
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value))
}

/**
 * Derives the output grid from the source aspect ratio and a requested density.
 *
 * `cellPx` is floored to an integer and the canvas sized from it, so cell
 * boundaries land on whole pixels. Fractional boundaries antialias against each
 * other and produce the classic hairline-seam artifact.
 *
 * Clamps `cols` down when `cols * rows` would exceed MAX_CELLS — a 1:10
 * panorama at 100 columns is 100,000 cells. Callers should surface the
 * corrected grid rather than silently rendering something else.
 */
export function deriveGrid(
	sourceWidth: number,
	sourceHeight: number,
	columns: number,
	targetLongEdge: number,
): Grid {
	let cols = clamp(columns, MIN_COLUMNS, MAX_COLUMNS)
	let rows = Math.max(1, Math.round((cols * sourceHeight) / sourceWidth))

	if (cols * rows > MAX_CELLS) {
		const scale = Math.sqrt(MAX_CELLS / (cols * rows))
		cols = Math.max(MIN_COLUMNS, Math.floor(cols * scale))
		rows = Math.max(1, Math.round((cols * sourceHeight) / sourceWidth))

		while (cols * rows > MAX_CELLS && cols > MIN_COLUMNS) {
			cols -= 1
			rows = Math.max(1, Math.round((cols * sourceHeight) / sourceWidth))
		}
	}

	// Past a certain aspect ratio, cols bottoms out at MIN_COLUMNS while rows is
	// still enormous — a 1:2048 sliver gives 8 x 16384 even at the floor. Rows
	// has to be capped too, or the ceiling this function documents is not
	// actually enforced and the caller allocates a sampling canvas tens of
	// thousands of pixels tall. The mosaic stops matching the source aspect
	// exactly at that point, which is the lesser of the two evils.
	rows = Math.max(1, Math.min(rows, Math.floor(MAX_CELLS / cols)))

	const cellPx = Math.max(1, Math.floor(targetLongEdge / Math.max(cols, rows)))
	const width = cols * cellPx
	const height = rows * cellPx

	return { cols, rows, cellPx, width, height }
}

/**
 * How much larger than the cell a rotated tile must be drawn to still cover it.
 *
 * Rotating a cell corner (+/-c/2, +/-c/2) into the tile's frame gives a maximum
 * coordinate magnitude of (c/2)(|cos t| + |sin t|), which must not exceed s/2.
 * So s >= c(|cos t| + |sin t|). Anything smaller exposes the background at the
 * cell corners.
 */
export function coverFactor(theta: number): number {
	return Math.abs(Math.cos(theta)) + Math.abs(Math.sin(theta))
}

/**
 * The tight minimum side for a possibly non-square cell:
 * max(w|cos t| + h|sin t|, w|sin t| + h|cos t|).
 *
 * `coverFactor` times the longer edge is always at least this, so it is safe
 * but conservative — up to ~33% oversize for a 2:1 cell at 45 degrees. The grid
 * uses square cells, where the two agree.
 */
export function coverSide(
	cellWidth: number,
	cellHeight: number,
	theta: number,
): number {
	const cos = Math.abs(Math.cos(theta))
	const sin = Math.abs(Math.sin(theta))
	return Math.max(
		cellWidth * cos + cellHeight * sin,
		cellWidth * sin + cellHeight * cos,
	)
}

/**
 * Deterministic PRNG. Same seed, same mosaic — preview and export must agree.
 *
 * The mulberry32 algorithm is bitwise by construction (xorshift-style mixing);
 * there is no non-bitwise way to express it.
 */
export function mulberry32(seed: number): () => number {
	// eslint-disable-next-line no-bitwise
	let state = seed >>> 0

	return function next(): number {
		// eslint-disable-next-line no-bitwise, unicorn/number-literal-case -- oxfmt normalises hex literals to lowercase
		state = (state + 0x6d2b79f5) >>> 0
		let t = state
		// eslint-disable-next-line no-bitwise
		t = Math.imul(t ^ (t >>> 15), t | 1)
		// eslint-disable-next-line no-bitwise
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
		// eslint-disable-next-line no-bitwise
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

/**
 * A seeded permutation of 0..count-1.
 *
 * Greedy assignment in raster order gives early cells the pick of the library
 * and later cells the leftovers, and because "later" means "further down the
 * image" that bias has spatial structure — a visible quality gradient from top
 * to bottom. Visiting cells in shuffled order keeps the same average quality
 * but leaves the residual with no spatial structure to see.
 */
export function shuffledOrder(count: number, seed: number): Uint32Array {
	const order = new Uint32Array(count)
	for (let i = 0; i < count; i++) order[i] = i

	const random = mulberry32(seed)
	for (let i = count - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1))
		const temp = order[i]
		order[i] = order[j]
		order[j] = temp
	}

	return order
}
