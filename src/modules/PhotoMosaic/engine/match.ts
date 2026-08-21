/**
 * Assigns one tile to every grid cell.
 *
 * Pure: no canvas, no DOM, no worker globals. Signatures arrive as flat
 * Float32Arrays so the inner loop stays monomorphic and allocation-free.
 */

import { signatureDistanceSq } from './color'
import {
	ADJACENCY_PENALTY,
	ADJACENCY_RADIUS,
	MATCH_YIELD_INTERVAL,
	REUSE_PENALTY,
	SIGNATURE_LENGTH,
} from './constants'
import { shuffledOrder } from './layout'

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
 * Collects the tiles already used within a Chebyshev `ADJACENCY_RADIUS` of
 * (cellCol, cellRow) into `out`.
 *
 * Gathered once per cell rather than re-scanned per candidate tile. The
 * neighbourhood is a property of the cell, not of the tile being scored, so
 * doing it inside the tile loop multiplied the matcher's real cost by the
 * neighbourhood size (up to 24 reads per candidate) — the brute-force bound
 * quoted at the end of this file assumes it happens out here.
 */
function collectAdjacentTiles(
	assignment: Int32Array,
	cols: number,
	rows: number,
	cellCol: number,
	cellRow: number,
	out: Set<number>,
): void {
	out.clear()

	const minCol = Math.max(0, cellCol - ADJACENCY_RADIUS)
	const maxCol = Math.min(cols - 1, cellCol + ADJACENCY_RADIUS)
	const minRow = Math.max(0, cellRow - ADJACENCY_RADIUS)
	const maxRow = Math.min(rows - 1, cellRow + ADJACENCY_RADIUS)

	for (let row = minRow; row <= maxRow; row++) {
		for (let col = minCol; col <= maxCol; col++) {
			if (col === cellCol && row === cellRow) continue
			const used = assignment[row * cols + col]
			if (used !== -1) out.add(used)
		}
	}
}

/**
 * Brute-force best tile for one cell among tiles under `maxUses`. Returns -1
 * if every tile is already at `maxUses`.
 */
function findBestTile(
	cellSignatures: Float32Array,
	cellOffset: number,
	tileSignatures: Float32Array,
	tileCount: number,
	weightC: number,
	usesSoFar: Uint16Array,
	maxUses: number,
	adjacentTiles: Set<number>,
): number {
	let bestTile = -1
	let bestScore = Number.POSITIVE_INFINITY

	for (let tileIndex = 0; tileIndex < tileCount; tileIndex++) {
		if (usesSoFar[tileIndex] >= maxUses) continue

		const tileOffset = tileIndex * SIGNATURE_LENGTH
		const distance = signatureDistanceSq(
			cellSignatures,
			cellOffset,
			tileSignatures,
			tileOffset,
			weightC,
		)
		const score =
			distance +
			REUSE_PENALTY * usesSoFar[tileIndex] +
			(adjacentTiles.has(tileIndex) ? ADJACENCY_PENALTY : 0)

		if (score < bestScore) {
			bestScore = score
			bestTile = tileIndex
		}
	}

	return bestTile
}

/**
 * The brute-force greedy assignment shared by every exported entry point.
 *
 * Visits cells in shuffled order (not raster order — see `shuffledOrder`),
 * scoring every tile against the cell's signature plus a reuse penalty and an
 * adjacency penalty. Tiles at `maxUses` are skipped; if that leaves a cell
 * with no candidate, the cap is raised to `ceil(cells / tileCount)` — enough
 * capacity for every cell to get a tile — so a pathological `spread` cannot
 * hang or crash the assignment.
 */
function* runAssignment(
	input: MatchInput,
): Generator<number, MatchResult, void> {
	const {
		cellSignatures,
		tileSignatures,
		cols,
		rows,
		tileCount,
		spread,
		weightC,
		seed,
	} = input
	const cellCount = cols * rows
	const assignment = new Int32Array(cellCount).fill(-1)
	const usesSoFar = new Uint16Array(tileCount)

	const initialMaxUses =
		tileCount > 0 ? Math.max(1, Math.ceil((cellCount / tileCount) * spread)) : 0
	const fallbackMaxUses =
		tileCount > 0 ? Math.max(1, Math.ceil(cellCount / tileCount)) : 0

	const order = shuffledOrder(cellCount, seed)
	// Reused across cells; `collectAdjacentTiles` clears it each time.
	const adjacentTiles = new Set<number>()
	let distinctTiles = 0
	let assignedCount = 0

	for (let k = 0; k < cellCount; k++) {
		const cellIndex = order[k]
		const cellRow = Math.floor(cellIndex / cols)
		const cellCol = cellIndex % cols
		const cellOffset = cellIndex * SIGNATURE_LENGTH

		collectAdjacentTiles(
			assignment,
			cols,
			rows,
			cellCol,
			cellRow,
			adjacentTiles,
		)

		let bestTile = findBestTile(
			cellSignatures,
			cellOffset,
			tileSignatures,
			tileCount,
			weightC,
			usesSoFar,
			initialMaxUses,
			adjacentTiles,
		)

		if (bestTile === -1 && tileCount > 0) {
			bestTile = findBestTile(
				cellSignatures,
				cellOffset,
				tileSignatures,
				tileCount,
				weightC,
				usesSoFar,
				fallbackMaxUses,
				adjacentTiles,
			)
		}

		if (bestTile !== -1) {
			assignment[cellIndex] = bestTile
			if (usesSoFar[bestTile] === 0) distinctTiles++
			usesSoFar[bestTile]++
		}

		assignedCount++
		if (assignedCount % MATCH_YIELD_INTERVAL === 0) yield assignedCount
	}

	yield assignedCount
	return { assignment, distinctTiles }
}

function drain(iterator: Generator<number, MatchResult, void>): MatchResult {
	let result = iterator.next()
	while (!result.done) {
		result = iterator.next()
	}
	return result.value
}

/**
 * Generator form, yielding the number of cells assigned so far.
 *
 * A generator rather than a plain function because the worker must actually
 * yield to its event loop between chunks: a synchronous loop that only calls
 * `postMessage` can never observe an inbound `cancel`, since the message queues
 * behind the running task.
 *
 * NOTE: the bucketed pre-filter described for large (cells * tileCount) is not
 * implemented — see the module-level remark at the bottom of this file for why.
 * This always runs the brute-force scan, identically to `assignTilesLinear`.
 */
export function* assignTilesIterative(
	input: MatchInput,
): Generator<number, MatchResult, void> {
	return yield* runAssignment(input)
}

/** Drains the generator. For tests and for grids small enough not to need yielding. */
export function assignTiles(input: MatchInput): MatchResult {
	return drain(assignTilesIterative(input))
}

/**
 * The brute-force scan, exposed so tests can assert the bucketed pre-filter
 * returns an identical assignment — the admissibility claim, tested rather than
 * asserted.
 */
export function assignTilesLinear(input: MatchInput): MatchResult {
	return drain(runAssignment(input))
}

/**
 * Why there is no bucketed pre-filter here.
 *
 * Pruning by mean colour needs the mean and the distance to share a weighting,
 * or Jensen's inequality no longer bounds one by the other. With a plain mean
 * against these corner/edge/centre weights (0.75/1/1.5) the bound can exceed
 * the true distance — four corner samples at +1 deviation and the centre at -4
 * give a weighted mean-square of ~24.6 against a naive bound of 25 — so a shell
 * walk would prune the actual best tile and diverge from brute force silently.
 *
 * It is not worth fixing, because MAX_CELLS * MAX_TILES caps the brute-force
 * scan at ~20M candidate pairs, which measures under a second. Exactness is
 * free here; the pre-filter would only buy risk.
 */
