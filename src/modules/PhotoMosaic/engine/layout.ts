/**
 * Grid geometry and deterministic randomness.
 *
 * Pure: no canvas, no DOM, no worker globals.
 */

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
	throw new Error('unimplemented')
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
	throw new Error('unimplemented')
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
	throw new Error('unimplemented')
}

/** Deterministic PRNG. Same seed, same mosaic — preview and export must agree. */
export function mulberry32(seed: number): () => number {
	throw new Error('unimplemented')
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
	throw new Error('unimplemented')
}
