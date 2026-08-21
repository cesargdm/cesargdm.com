import type { RejectedFile } from '../protocol'

import { writeSignature } from './color'
import {
	ATLAS_PAGE_PX,
	DECODE_CONCURRENCY,
	DECODE_CONCURRENCY_FALLBACK,
	HEADER_BYTES,
	MAX_FILE_BYTES,
	MAX_TILES,
	SIGNATURE_LENGTH,
	SIGNATURE_SOURCE_PX,
	TILE_PX,
	TILES_PER_PAGE,
	TILES_PER_ROW,
} from './constants'
import { readImageSize } from './image-size'

/**
 * The tile library: every user photo, cropped square, downscaled to TILE_PX and
 * packed into atlas pages.
 *
 * Atlas pages rather than an array of ImageBitmaps, for two reasons. Memory:
 * WebKit caps total canvas memory per page, so what matters is the sum of live
 * backing stores — two canvases at a size we chose are a known 18.9MB and free
 * deterministically, while 512 opaque bitmap allocations cannot be budgeted
 * against. Speed: drawing 10,000 cells from 2 source canvases is 2 texture
 * binds, against 512 that thrash the texture cache on the pass that dominates.
 */

/** Where one tile lives: which atlas page, and its top-left corner within it. */
export type TileSlot = { page: OffscreenCanvas; sx: number; sy: number }

export type IngestSummary = {
	/** Tiles in the library after this call. */
	total: number
	/** Files looked at, before subsampling to MAX_TILES. */
	considered: number
	rejected: RejectedFile[]
}

export type TileLibrary = {
	readonly count: number
	/** count * SIGNATURE_LENGTH OKLab values, for the matcher. */
	readonly signatures: Float32Array
	slotOf: (index: number) => TileSlot
	/**
	 * Decodes and packs files, bounded by `concurrency`.
	 *
	 * Concurrency must drop to 1 when the resize options dict is unavailable:
	 * that path retains a full-resolution square crop per in-flight decode, and
	 * four of those at once is fatal on exactly the old devices that need it.
	 */
	ingestMany: (
		files: File[],
		onProgress: (done: number, total: number) => Promise<void>,
	) => Promise<IngestSummary>
	/** Zeroes every page's width AND height — WebKit frees the backing store there, not at GC. */
	clear: () => void
}

type CropRect = { sx: number; sy: number; s: number }

function centerCrop(width: number, height: number): CropRect {
	const s = Math.min(width, height)
	return {
		s,
		sx: Math.floor((width - s) / 2),
		sy: Math.floor((height - s) / 2),
	}
}

/** Factor per downscale step, and the "close enough" multiple of TILE_PX to stop at. */
const HALVING_FACTOR = 2

function dedupeKeyFor(file: File): string {
	return `${file.name}|${file.size}|${file.lastModified}`
}

/**
 * Downscales a large square bitmap to TILE_PX by repeated halving, closing
 * every intermediate bitmap (including `source`) as soon as it has been drawn
 * from. A single 30x `drawImage` aliases badly even at the highest smoothing
 * quality, so the last step is always within 2x of the target.
 */
async function downscaleByHalving(source: ImageBitmap): Promise<ImageBitmap> {
	let current = source
	let width = source.width
	let height = source.height

	while (
		width > TILE_PX * HALVING_FACTOR ||
		height > TILE_PX * HALVING_FACTOR
	) {
		const nextWidth = Math.max(TILE_PX, Math.floor(width / HALVING_FACTOR))
		const nextHeight = Math.max(TILE_PX, Math.floor(height / HALVING_FACTOR))

		const step = new OffscreenCanvas(nextWidth, nextHeight)
		const stepContext = getContext2d(step)

		stepContext.imageSmoothingEnabled = true
		stepContext.imageSmoothingQuality = 'high'
		stepContext.drawImage(current, 0, 0, nextWidth, nextHeight)

		current.close()
		current = step.transferToImageBitmap()
		width = nextWidth
		height = nextHeight
	}

	const final = new OffscreenCanvas(TILE_PX, TILE_PX)
	const finalContext = getContext2d(final)

	finalContext.imageSmoothingEnabled = true
	finalContext.imageSmoothingQuality = 'high'
	finalContext.drawImage(current, 0, 0, TILE_PX, TILE_PX)
	current.close()

	return final.transferToImageBitmap()
}

/**
 * Single-decode ingestion: reads dimensions from the header when possible so
 * the centre-crop rectangle can be passed straight to the decode. Falls back
 * to a plain decode to learn the dimensions, reusing that bitmap as the crop
 * source rather than decoding the file twice.
 */
async function decodeTile(
	file: File,
	resizeSupported: boolean,
): Promise<ImageBitmap> {
	const headerBytes = new Uint8Array(
		await file.slice(0, HEADER_BYTES).arrayBuffer(),
	)
	const knownSize = readImageSize(headerBytes)

	let source: File | ImageBitmap = file
	let fullBitmap: ImageBitmap | null = null
	let width: number
	let height: number

	if (knownSize) {
		width = knownSize.width
		height = knownSize.height
	} else {
		fullBitmap = await createImageBitmap(file)
		source = fullBitmap
		width = fullBitmap.width
		height = fullBitmap.height
	}

	const { sx, sy, s } = centerCrop(width, height)

	if (resizeSupported) {
		const tile = await createImageBitmap(source, sx, sy, s, s, {
			resizeWidth: TILE_PX,
			resizeHeight: TILE_PX,
			resizeQuality: 'high',
			// 'none', deliberately. The crop rectangle above was computed from the
			// dimensions in the container header, which are pre-rotation; letting
			// the decoder apply EXIF orientation first would leave the rectangle
			// measured against a frame that no longer exists, and on a rotated
			// iPhone photo it runs off the edge and yields an off-centre tile with
			// a transparent stripe. It also keeps this path consistent with the
			// fallback below, which cannot honour the dict at all. A sideways tile
			// is invisible at 96px under rotation jitter; a mis-cropped one is not.
			imageOrientation: 'none',
		})
		fullBitmap?.close()
		return tile
	}

	const cropped = await createImageBitmap(source, sx, sy, s, s)
	fullBitmap?.close()

	return downscaleByHalving(cropped)
}

function getContext2d(
	canvas: OffscreenCanvas,
	options?: CanvasRenderingContext2DSettings,
): OffscreenCanvasRenderingContext2D {
	const context = canvas.getContext('2d', options)
	if (!context) throw new Error('failed to acquire a 2d context')
	return context
}

/** Evenly-spaced indices into a `total`-length array, `take` of them. */
function evenlySpacedIndices(total: number, take: number): Set<number> {
	const indices = new Set<number>()
	if (take <= 0) return indices

	for (let i = 0; i < take; i++) {
		indices.add(Math.floor((i * total) / take))
	}

	return indices
}

export function createTileLibrary(resizeSupported: boolean): TileLibrary {
	const pages: OffscreenCanvas[] = []
	const pageContexts: OffscreenCanvasRenderingContext2D[] = []
	const signatures = new Float32Array(MAX_TILES * SIGNATURE_LENGTH)
	const dedupeKeys = new Set<string>()
	let count = 0

	const scratch = new OffscreenCanvas(SIGNATURE_SOURCE_PX, SIGNATURE_SOURCE_PX)
	const scratchContext = getContext2d(scratch, { willReadFrequently: true })

	function ensurePage(pageIndex: number): void {
		if (pages[pageIndex]) return

		const page = new OffscreenCanvas(ATLAS_PAGE_PX, ATLAS_PAGE_PX)
		pages[pageIndex] = page
		pageContexts[pageIndex] = getContext2d(page)
	}

	function slotOf(index: number): TileSlot {
		const pageIndex = Math.floor(index / TILES_PER_PAGE)
		const withinPage = index % TILES_PER_PAGE

		return {
			page: pages[pageIndex],
			sx: (index % TILES_PER_ROW) * TILE_PX,
			sy: Math.floor(withinPage / TILES_PER_ROW) * TILE_PX,
		}
	}

	async function ingestFile(file: File): Promise<RejectedFile | null> {
		if (file.size > MAX_FILE_BYTES) {
			return { name: file.name, reason: 'too-large' }
		}

		const key = dedupeKeyFor(file)
		if (dedupeKeys.has(key)) {
			return { name: file.name, reason: 'duplicate' }
		}

		if (count >= MAX_TILES) {
			return { name: file.name, reason: 'over-cap' }
		}

		let tile: ImageBitmap
		try {
			tile = await decodeTile(file, resizeSupported)
		} catch {
			return { name: file.name, reason: 'decode' }
		}

		if (count >= MAX_TILES) {
			tile.close()
			return { name: file.name, reason: 'over-cap' }
		}
		if (dedupeKeys.has(key)) {
			tile.close()
			return { name: file.name, reason: 'duplicate' }
		}

		const index = count
		count += 1
		dedupeKeys.add(key)

		const pageIndex = Math.floor(index / TILES_PER_PAGE)
		ensurePage(pageIndex)
		const slot = slotOf(index)
		pageContexts[pageIndex].drawImage(tile, slot.sx, slot.sy)

		scratchContext.clearRect(0, 0, SIGNATURE_SOURCE_PX, SIGNATURE_SOURCE_PX)
		scratchContext.drawImage(
			tile,
			0,
			0,
			SIGNATURE_SOURCE_PX,
			SIGNATURE_SOURCE_PX,
		)
		const imageData = scratchContext.getImageData(
			0,
			0,
			SIGNATURE_SOURCE_PX,
			SIGNATURE_SOURCE_PX,
		)
		writeSignature(
			imageData.data,
			SIGNATURE_SOURCE_PX,
			signatures,
			index * SIGNATURE_LENGTH,
		)

		tile.close()
		return null
	}

	async function ingestMany(
		files: File[],
		onProgress: (done: number, total: number) => Promise<void>,
	): Promise<IngestSummary> {
		const considered = files.length
		const capacity = Math.max(0, MAX_TILES - count)
		const rejected: RejectedFile[] = []

		let selected = files
		if (files.length > capacity) {
			const keep = evenlySpacedIndices(files.length, capacity)
			selected = []
			for (let i = 0; i < files.length; i++) {
				if (keep.has(i)) {
					selected.push(files[i])
				} else {
					rejected.push({ name: files[i].name, reason: 'over-cap' })
				}
			}
		}

		const total = selected.length
		let done = 0
		let nextIndex = 0

		async function worker(): Promise<void> {
			while (nextIndex < selected.length) {
				const index = nextIndex
				nextIndex += 1

				const outcome = await ingestFile(selected[index])
				if (outcome) rejected.push(outcome)

				done += 1
				await onProgress(done, total)
			}
		}

		const concurrency = resizeSupported
			? DECODE_CONCURRENCY
			: DECODE_CONCURRENCY_FALLBACK
		const workerCount = Math.min(concurrency, selected.length)
		await Promise.all(Array.from({ length: workerCount }, () => worker()))

		return { total: count, considered, rejected }
	}

	function clear(): void {
		for (const page of pages) {
			page.width = 0
			page.height = 0
		}
		pages.length = 0
		pageContexts.length = 0
		count = 0
		dedupeKeys.clear()
		signatures.fill(0)
	}

	return {
		get count() {
			return count
		},
		get signatures() {
			return signatures
		},
		slotOf,
		ingestMany,
		clear,
	}
}
