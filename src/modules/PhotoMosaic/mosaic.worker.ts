/**
 * The mosaic engine's worker thread: owns the tile library, the target grid,
 * and every canvas, and drives the match/render generators cooperatively so
 * an inbound `cancel` is never stuck behind a running task.
 *
 * Relative imports only — this bundle never runs Vite's `worker.plugins`, so
 * nothing here may reach a `.css.ts`, a `.po`, or a `@/` alias.
 */

import {
	detectBlendModes,
	detectResizeSupport,
	probeExactCanvas,
	probeMaxCanvasArea,
} from './engine/caps'
import { writeSignature } from './engine/color'
import {
	ORIENTATIONS,
	PROGRESS_INTERVAL_MS,
	SLICE_BUDGET_MS,
	SIGNATURE_LENGTH,
	SIGNATURE_SOURCE_PX,
	WEIGHT_C,
} from './engine/constants'
import type { MatchInput } from './engine/match'
import { assignTilesIterative } from './engine/match'
import type { RenderCaps } from './engine/render'
import { renderMosaic } from './engine/render'
import type { TileLibrary } from './engine/tiles'
import { createTileLibrary } from './engine/tiles'
import type {
	EngineCaps,
	FromWorker,
	GridSpec,
	MosaicErrorCode,
	RenderOptions,
	RenderTarget,
	ToWorker,
} from './protocol'
import { readMessage } from './protocol'

const PROBE_CANVAS_PX = 1
const SIGNATURE_SCRATCH_CHANNELS = 4

let library: TileLibrary | null = null
let caps: EngineCaps | null = null
let previewCanvas: OffscreenCanvas | null = null
let grid: GridSpec | null = null
let samples: Uint8ClampedArray | null = null
let assignment: Int32Array | null = null
let turnOf: Uint8Array | null = null
let exportCanvas: OffscreenCanvas | null = null
let currentJobId = 0

type PendingRender = {
	jobId: number
	target: RenderTarget
	options: RenderOptions
}
let renderRunning = false
let pendingRender: PendingRender | null = null

const channel = new MessageChannel()

function yieldNow(): Promise<void> {
	const scoped = self as unknown as {
		scheduler?: { yield?: () => Promise<void> }
	}
	if (scoped.scheduler?.yield) return scoped.scheduler.yield()
	return new Promise((resolve) => {
		// eslint-disable-next-line unicorn/prefer-add-event-listener -- addEventListener needs an explicit port.start(); onmessage auto-starts the port
		channel.port1.onmessage = () => resolve()
		channel.port2.postMessage(0)
	})
}

function post(message: FromWorker): void {
	// eslint-disable-next-line unicorn/require-post-message-target-origin -- worker postMessage's 2nd arg is a transfer list, not a targetOrigin
	self.postMessage(message)
}

function jobIdOf(message: ToWorker): number {
	return 'jobId' in message ? message.jobId : currentJobId
}

function classifyErrorCode(error: unknown): MosaicErrorCode {
	const text = (
		error instanceof Error ? error.message : String(error)
	).toLowerCase()
	if (text.includes('memory') || text.includes('allocation')) return 'memory'
	return 'unknown'
}

function errorDetail(error: unknown): string {
	return error instanceof Error ? error.message : String(error)
}

async function handleInit(): Promise<void> {
	const resizeSupported = await detectResizeSupport()
	library = createTileLibrary(resizeSupported)

	const probeCanvas = new OffscreenCanvas(PROBE_CANVAS_PX, PROBE_CANVAS_PX)
	const probeCtx = probeCanvas.getContext('2d')
	const blendModes = probeCtx ? detectBlendModes(probeCtx) : false

	caps = { resizeImageBitmap: resizeSupported, blendModes }
	post({ type: 'ready', caps })
}

async function handleAddTiles(
	message: Extract<ToWorker, { type: 'add-tiles' }>,
): Promise<void> {
	if (!library) throw new Error('tile library not initialised')
	currentJobId = message.jobId

	let lastPost = 0
	const summary = await library.ingestMany(
		message.files,
		async (done, total) => {
			const now = performance.now()
			if (done === total || now - lastPost >= PROGRESS_INTERVAL_MS) {
				post({
					type: 'progress',
					jobId: message.jobId,
					phase: 'ingest',
					done,
					total,
				})
				lastPost = now
			}
			await yieldNow()
		},
	)

	post({
		type: 'tiles',
		jobId: message.jobId,
		total: summary.total,
		considered: summary.considered,
		rejected: summary.rejected,
	})
}

/**
 * `samples` is `(cols*SIGNATURE_SOURCE_PX) x (rows*SIGNATURE_SOURCE_PX)` RGBA,
 * but `writeSignature` wants a square `sourcePx x sourcePx` buffer — copy each
 * cell's block into a reusable scratch array first.
 *
 * The block is SIGNATURE_SOURCE_PX square so that cells go through exactly the
 * same linear-light block averaging as tiles do; anything smaller would compare
 * linearly-averaged tiles against gamma-averaged cells.
 */
function writeCellSignatures(
	targetGrid: GridSpec,
	targetSamples: Uint8ClampedArray,
	out: Float32Array,
): void {
	const { cols, rows } = targetGrid
	const sampleWidth = cols * SIGNATURE_SOURCE_PX
	const scratch = new Uint8ClampedArray(
		SIGNATURE_SOURCE_PX * SIGNATURE_SOURCE_PX * SIGNATURE_SCRATCH_CHANNELS,
	)

	for (let cellIndex = 0; cellIndex < cols * rows; cellIndex++) {
		const cellCol = cellIndex % cols
		const cellRow = Math.floor(cellIndex / cols)

		for (let dy = 0; dy < SIGNATURE_SOURCE_PX; dy++) {
			const sy = cellRow * SIGNATURE_SOURCE_PX + dy
			for (let dx = 0; dx < SIGNATURE_SOURCE_PX; dx++) {
				const sx = cellCol * SIGNATURE_SOURCE_PX + dx
				const srcIndex = (sy * sampleWidth + sx) * SIGNATURE_SCRATCH_CHANNELS
				const dstIndex =
					(dy * SIGNATURE_SOURCE_PX + dx) * SIGNATURE_SCRATCH_CHANNELS
				scratch[dstIndex] = targetSamples[srcIndex]
				scratch[dstIndex + 1] = targetSamples[srcIndex + 1]
				scratch[dstIndex + 2] = targetSamples[srcIndex + 2]
				scratch[dstIndex + 3] = targetSamples[srcIndex + 3]
			}
		}

		writeSignature(
			scratch,
			SIGNATURE_SOURCE_PX,
			out,
			cellIndex * SIGNATURE_LENGTH,
		)
	}
}

async function handleMatch(
	message: Extract<ToWorker, { type: 'match' }>,
): Promise<void> {
	if (!library || library.count === 0) {
		post({ type: 'failed', jobId: message.jobId, code: 'no-tiles' })
		return
	}
	if (!grid || !samples) {
		post({ type: 'failed', jobId: message.jobId, code: 'no-target' })
		return
	}

	const cellCount = grid.cols * grid.rows
	const cellSignatures = new Float32Array(cellCount * SIGNATURE_LENGTH)
	writeCellSignatures(grid, samples, cellSignatures)

	const input: MatchInput = {
		cellSignatures,
		tileSignatures: library.signatures,
		cols: grid.cols,
		rows: grid.rows,
		tileCount: library.count,
		spread: message.options.spread,
		weightC: message.options.blackAndWhite ? 0 : WEIGHT_C,
		orientations: message.options.allowRotation ? ORIENTATIONS : 1,
		seed: message.options.seed,
	}

	currentJobId = message.jobId
	const iterator = assignTilesIterative(input)
	let lastPost = 0
	let sliceStart = performance.now()
	let result = iterator.next()

	while (!result.done) {
		if (currentJobId !== message.jobId) {
			post({ type: 'cancelled', jobId: message.jobId })
			return
		}

		const now = performance.now()
		const isFinal = result.value >= cellCount
		if (isFinal || now - lastPost >= PROGRESS_INTERVAL_MS) {
			post({
				type: 'progress',
				jobId: message.jobId,
				phase: 'match',
				done: Math.min(result.value, cellCount),
				total: cellCount,
			})
			lastPost = now
		}

		// Yield on elapsed time, not on a fixed count: that is what makes the
		// cadence fit the device instead of a guess about it.
		if (performance.now() - sliceStart >= SLICE_BUDGET_MS) {
			await yieldNow()
			sliceStart = performance.now()
		}
		result = iterator.next()
	}

	if (currentJobId !== message.jobId) {
		post({ type: 'cancelled', jobId: message.jobId })
		return
	}

	assignment = result.value.assignment
	turnOf = result.value.orientation
	post({
		type: 'matched',
		jobId: message.jobId,
		distinctTiles: result.value.distinctTiles,
	})
}

async function runRenderJob(
	jobId: number,
	target: RenderTarget,
	options: RenderOptions,
): Promise<void> {
	try {
		if (!library || library.count === 0) {
			post({ type: 'failed', jobId, code: 'no-tiles' })
			return
		}
		if (!grid || !samples || !assignment || !turnOf) {
			post({ type: 'failed', jobId, code: 'no-target' })
			return
		}

		// The grid from `set-target` carries the cell COUNT, which is fixed by the
		// match, but its cellPx belongs to whatever size it was derived for. Each
		// render re-derives cellPx from its own target and sizes the canvas from
		// that, so cell boundaries stay on whole pixels (fractional ones
		// antialias against each other into hairline seams) and the preview and
		// the export are the same mosaic at two scales rather than two different
		// crops of one.
		// Both axes, not just the width: the target is a bounding box, and the
		// island sends a square one for previews. Dividing by cols alone would
		// make a portrait mosaic overflow it — a tall panorama at 60 columns
		// would render several times larger than asked for, and could cross the
		// canvas-area limit and come back silently blank.
		const cellPx = Math.max(
			1,
			Math.min(
				Math.floor(target.width / grid.cols),
				Math.floor(target.height / grid.rows),
			),
		)
		const renderGrid = { cols: grid.cols, rows: grid.rows, cellPx }
		const width = renderGrid.cols * cellPx
		const height = renderGrid.rows * cellPx

		let canvas: OffscreenCanvas
		if (target.kind === 'export') {
			if (!probeExactCanvas(width, height)) {
				post({ type: 'failed', jobId, code: 'canvas-blank' })
				return
			}
			if (exportCanvas) {
				exportCanvas.width = 0
				exportCanvas.height = 0
			}
			exportCanvas = new OffscreenCanvas(width, height)
			canvas = exportCanvas
		} else {
			if (!previewCanvas) {
				post({
					type: 'failed',
					jobId,
					code: 'unknown',
					detail: 'no preview canvas attached',
				})
				return
			}
			previewCanvas.width = width
			previewCanvas.height = height
			canvas = previewCanvas
		}

		const renderCaps: RenderCaps = { blendModes: caps?.blendModes ?? false }
		const totalCells = grid.cols * grid.rows
		const start = performance.now()

		currentJobId = jobId
		const iterator = renderMosaic(
			canvas,
			library,
			assignment,
			turnOf,
			renderGrid,
			samples,
			options,
			renderCaps,
		)
		let lastPost = 0
		let sliceStart = performance.now()
		let result = iterator.next()

		while (!result.done) {
			if (currentJobId !== jobId) {
				post({ type: 'cancelled', jobId })
				return
			}

			const now = performance.now()
			const isFinal = result.value >= totalCells
			if (isFinal || now - lastPost >= PROGRESS_INTERVAL_MS) {
				post({
					type: 'progress',
					jobId,
					phase: 'draw',
					done: Math.min(result.value, totalCells),
					total: totalCells,
				})
				lastPost = now
			}

			// Same adaptive cadence as the match loop: hand control back once this
			// slice has used its time budget, whatever number of cells that took.
			if (now - sliceStart >= SLICE_BUDGET_MS) {
				await yieldNow()
				sliceStart = performance.now()
			}
			result = iterator.next()
		}

		if (currentJobId !== jobId) {
			post({ type: 'cancelled', jobId })
			return
		}

		post({
			type: 'rendered',
			jobId,
			kind: target.kind,
			ms: performance.now() - start,
		})
	} catch (error) {
		post({
			type: 'failed',
			jobId,
			code: classifyErrorCode(error),
			detail: errorDetail(error),
		})
	}
}

async function handleRender(
	message: Extract<ToWorker, { type: 'render' }>,
): Promise<void> {
	if (renderRunning) {
		pendingRender = {
			jobId: message.jobId,
			target: message.target,
			options: message.options,
		}
		return
	}

	renderRunning = true
	await runRenderJob(message.jobId, message.target, message.options)
	renderRunning = false

	const next = pendingRender
	pendingRender = null
	if (next) {
		await handleRender({
			type: 'render',
			jobId: next.jobId,
			target: next.target,
			options: next.options,
		})
	}
}

async function handleEncode(
	message: Extract<ToWorker, { type: 'encode' }>,
): Promise<void> {
	if (!exportCanvas) throw new Error('encode requested before an export render')

	const width = exportCanvas.width
	const height = exportCanvas.height
	const blob = await exportCanvas.convertToBlob({
		type: message.mime,
		quality: message.quality,
	})

	post({ type: 'encoded', jobId: message.jobId, blob, width, height })

	exportCanvas.width = 0
	exportCanvas.height = 0
	exportCanvas = null
}

function handleDispose(): void {
	library?.clear()
	library = null

	if (previewCanvas) {
		previewCanvas.width = 0
		previewCanvas.height = 0
		previewCanvas = null
	}
	if (exportCanvas) {
		exportCanvas.width = 0
		exportCanvas.height = 0
		exportCanvas = null
	}

	caps = null
	grid = null
	samples = null
	assignment = null
	turnOf = null
	pendingRender = null
	renderRunning = false
}

async function handleMessage(message: ToWorker): Promise<void> {
	try {
		switch (message.type) {
			case 'init': {
				await handleInit()
				return
			}
			case 'attach-preview': {
				previewCanvas = message.canvas
				return
			}
			case 'probe-canvas': {
				post({ type: 'canvas-limit', maxArea: probeMaxCanvasArea() })
				return
			}
			case 'add-tiles': {
				await handleAddTiles(message)
				return
			}
			case 'clear-tiles': {
				library?.clear()
				return
			}
			case 'set-target': {
				grid = message.grid
				samples = message.samples
				assignment = null
				return
			}
			case 'match': {
				await handleMatch(message)
				return
			}
			case 'render': {
				await handleRender(message)
				return
			}
			case 'encode': {
				await handleEncode(message)
				return
			}
			case 'cancel': {
				currentJobId += 1
				// The queued render has to go too. Bumping the job id only stops the
				// draw that is running; the one waiting behind it would start the
				// moment that returned and report itself finished, so Cancel would
				// visibly not stick.
				pendingRender = null
				return
			}
			case 'dispose': {
				handleDispose()
				return
			}
			default: {
				post({
					type: 'failed',
					jobId: jobIdOf(message),
					code: 'unknown',
					detail: 'unrecognised message type',
				})
			}
		}
	} catch (error) {
		post({
			type: 'failed',
			jobId: jobIdOf(message),
			code: classifyErrorCode(error),
			detail: errorDetail(error),
		})
	}
}

// eslint-disable-next-line unicorn/prefer-add-event-listener -- addEventListener needs an explicit port.start(); onmessage auto-starts the port
self.onmessage = (event: MessageEvent) => {
	void handleMessage(readMessage<ToWorker>(event))
}
