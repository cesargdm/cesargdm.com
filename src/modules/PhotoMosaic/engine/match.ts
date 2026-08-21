/**
 * Assigns one tile to every grid cell.
 *
 * Pure: no canvas, no DOM, no worker globals. Signatures arrive as flat
 * Float32Arrays so the inner loop stays monomorphic and allocation-free.
 */

export type MatchInput = {
	/** cols * rows * SIGNATURE_LENGTH, in row-major cell order. */
	cellSignatures: Float32Array
	/** tileCount * SIGNATURE_LENGTH. */
	tileSignatures: Float32Array
	cols: number
	rows: number
	tileCount: number
	/** maxUses = ceil(cells / tiles * spread). Above 1 the library cannot run dry. */
	spread: number
	/** 0 in black-and-white mode. */
	weightC: number
	seed: number
}

export type MatchResult = {
	/** cols * rows tile indices, in row-major cell order. */
	assignment: Int32Array
	distinctTiles: number
}

/**
 * Generator form, yielding the number of cells assigned so far.
 *
 * A generator rather than a plain function because the worker must actually
 * yield to its event loop between chunks: a synchronous loop that only calls
 * `postMessage` can never observe an inbound `cancel`, since the message queues
 * behind the running task.
 */
export function* assignTilesIterative(
	input: MatchInput,
): Generator<number, MatchResult, void> {
	throw new Error('unimplemented')
}

/** Drains the generator. For tests and for grids small enough not to need yielding. */
export function assignTiles(input: MatchInput): MatchResult {
	throw new Error('unimplemented')
}

/**
 * The brute-force scan, exposed so tests can assert the bucketed pre-filter
 * returns an identical assignment — the admissibility claim, tested rather than
 * asserted.
 */
export function assignTilesLinear(input: MatchInput): MatchResult {
	throw new Error('unimplemented')
}
