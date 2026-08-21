import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'

import {
	ANALYSIS_MAX_PX,
	DEFAULT_COLUMNS,
	DEFAULT_ROTATION_DEGREES,
	DEFAULT_TINT,
	JPEG_QUALITY,
	JPEG_THRESHOLD_AREA,
	MIME_JPEG,
	MIME_PNG,
	NATIVE_DETAIL_CELL_PX,
	READY_TIMEOUT_MS,
	RENDER_DEBOUNCE_MS,
	SIGNATURE_SOURCE_PX,
} from './engine/constants'
import type { Grid } from './engine/layout'
import { deriveGrid } from './engine/layout'
import type {
	FromWorker,
	MosaicErrorCode,
	MosaicPhase,
	RejectedFile,
	ToWorker,
} from './protocol'
import { readMessage } from './protocol'

/** Long edge the preview renders at; CSS scales it down to fit. */
const PREVIEW_MAX_PX = 1200

/** Long edges offered for export, before the canvas-area filter. */
const EXPORT_EDGES = [1024, 2048, 4096, 8192]

export type ExportOption = {
	edge: number
	width: number
	height: number
	cellPx: number
	/** False when the browser's canvas limit cannot hold it. */
	available: boolean
	nativeDetail: boolean
}

export type Settings = {
	columns: number
	tint: number
	rotation: number
	blackAndWhite: boolean
}

type State = {
	supported: boolean | null
	sourceReady: boolean
	/** Analysis-canvas dimensions, so export sizes derive without touching a ref. */
	sourceWidth: number
	sourceHeight: number
	tileCount: number
	/** Files offered in the most recent batch, before the MAX_TILES subsample. */
	considered: number
	/** Files accepted from that batch. */
	added: number
	rejected: RejectedFile[]
	ingesting: boolean
	job: 'idle' | 'matching' | 'drawing' | 'encoding' | 'done'
	phase: MosaicPhase | null
	progress: number
	error: MosaicErrorCode | null
	maxArea: number | null
	grid: Grid | null
	downloadUrl: string | null
	downloadName: string | null
	matchDirty: boolean
	renderDirty: boolean
	settings: Settings
}

type Action =
	| { type: 'unsupported' }
	| { type: 'supported' }
	| { type: 'source'; grid: Grid; width: number; height: number }
	| { type: 'ingest-start' }
	| {
			type: 'tiles'
			total: number
			considered: number
			added: number
			rejected: RejectedFile[]
	  }
	| { type: 'grid'; grid: Grid }
	| { type: 'job'; job: State['job'] }
	| { type: 'progress'; phase: MosaicPhase; progress: number }
	| { type: 'rendered' }
	| { type: 'encoded'; url: string; name: string }
	| { type: 'error'; code: MosaicErrorCode }
	| { type: 'limits'; maxArea: number }
	| { type: 'export-cleared' }
	| { type: 'settings'; patch: Partial<Settings>; invalidatesMatch: boolean }

const INITIAL: State = {
	supported: null,
	sourceReady: false,
	sourceWidth: 0,
	sourceHeight: 0,
	tileCount: 0,
	considered: 0,
	added: 0,
	rejected: [],
	ingesting: false,
	job: 'idle',
	phase: null,
	progress: 0,
	error: null,
	maxArea: null,
	grid: null,
	downloadUrl: null,
	downloadName: null,
	matchDirty: true,
	renderDirty: true,
	settings: {
		columns: DEFAULT_COLUMNS,
		tint: DEFAULT_TINT,
		rotation: DEFAULT_ROTATION_DEGREES,
		blackAndWhite: false,
	},
}

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'unsupported': {
			return { ...state, supported: false }
		}
		case 'supported': {
			return { ...state, supported: true }
		}
		case 'source': {
			return {
				...state,
				sourceReady: true,
				sourceWidth: action.width,
				sourceHeight: action.height,
				grid: action.grid,
				error: null,
				matchDirty: true,
				renderDirty: true,
			}
		}
		case 'ingest-start': {
			return { ...state, ingesting: true, error: null }
		}
		case 'tiles': {
			// Both describe the batch that just finished, not the session. Adding
			// them up while `tileCount` stays absolute produced messages that never
			// happened — re-picking the same photos would claim "using 5 of your 10"
			// when the second five were simply duplicates.
			return {
				...state,
				ingesting: false,
				phase: null,
				progress: 0,
				tileCount: action.total,
				considered: action.considered,
				added: action.added,
				rejected: action.rejected,
				matchDirty: true,
				renderDirty: true,
			}
		}
		case 'grid': {
			return {
				...state,
				grid: action.grid,
				matchDirty: true,
				renderDirty: true,
			}
		}
		case 'job': {
			return { ...state, job: action.job, error: null }
		}
		case 'progress': {
			return { ...state, phase: action.phase, progress: action.progress }
		}
		case 'rendered': {
			return {
				...state,
				job: 'done',
				phase: null,
				progress: 1,
				matchDirty: false,
				renderDirty: false,
			}
		}
		case 'encoded': {
			return {
				...state,
				job: 'done',
				phase: null,
				downloadUrl: action.url,
				downloadName: action.name,
			}
		}
		case 'error': {
			return { ...state, job: 'idle', phase: null, error: action.code }
		}
		case 'limits': {
			return { ...state, maxArea: action.maxArea }
		}
		case 'export-cleared': {
			return { ...state, downloadUrl: null, downloadName: null }
		}
		case 'settings': {
			return {
				...state,
				settings: { ...state.settings, ...action.patch },
				matchDirty: state.matchDirty || action.invalidatesMatch,
				renderDirty: true,
			}
		}
		default: {
			return state
		}
	}
}

/** Halving repeatedly, because one large-ratio drawImage aliases thin detail away. */
function downscaleStepwise(
	source: CanvasImageSource,
	sourceWidth: number,
	sourceHeight: number,
	maxEdge: number,
): HTMLCanvasElement {
	let width = sourceWidth
	let height = sourceHeight
	let current: CanvasImageSource = source

	const scratch = document.createElement('canvas')
	const scratchContext = scratch.getContext('2d')
	if (!scratchContext) throw new Error('2d context unavailable')

	while (Math.max(width, height) > maxEdge * 2) {
		const nextWidth = Math.max(1, Math.floor(width / 2))
		const nextHeight = Math.max(1, Math.floor(height / 2))
		const step = document.createElement('canvas')
		step.width = nextWidth
		step.height = nextHeight
		const stepContext = step.getContext('2d')
		if (!stepContext) throw new Error('2d context unavailable')
		stepContext.imageSmoothingEnabled = true
		stepContext.imageSmoothingQuality = 'high'
		stepContext.drawImage(current, 0, 0, nextWidth, nextHeight)
		current = step
		width = nextWidth
		height = nextHeight
	}

	const scale = Math.min(1, maxEdge / Math.max(width, height))
	scratch.width = Math.max(1, Math.round(width * scale))
	scratch.height = Math.max(1, Math.round(height * scale))
	scratchContext.imageSmoothingEnabled = true
	scratchContext.imageSmoothingQuality = 'high'
	scratchContext.drawImage(current, 0, 0, scratch.width, scratch.height)

	return scratch
}

export function useMosaicEngine() {
	const [state, dispatch] = useReducer(reducer, INITIAL)

	const workerRef = useRef<Worker | null>(null)
	const jobIdRef = useRef(0)
	const seedRef = useRef(1)
	const analysisRef = useRef<HTMLCanvasElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const transferredRef = useRef(false)
	const urlRef = useRef<string | null>(null)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const pendingExportRef = useRef<string | null>(null)
	const settingsRef = useRef(state.settings)
	const gridRef = useRef<Grid | null>(null)
	const tileCountRef = useRef(0)

	// Mirrored into refs rather than read from state inside the worker callbacks,
	// which close over the render they were created in. Updated in an effect, not
	// during render — every caller runs after commit, so there is no staleness.
	useEffect(() => {
		settingsRef.current = state.settings
		gridRef.current = state.grid
	}, [state.settings, state.grid])

	const post = useCallback((message: ToWorker, transfer?: Transferable[]) => {
		workerRef.current?.postMessage(message, transfer ?? [])
	}, [])

	const revokeUrl = useCallback(() => {
		if (urlRef.current) {
			URL.revokeObjectURL(urlRef.current)
			urlRef.current = null
		}
	}, [])

	/**
	 * Hands the preview canvas to the worker.
	 *
	 * Called from both the ref callback and the `ready` handler because the order
	 * is not fixed: React attaches refs during commit, before effects run, so on
	 * mount there is no worker yet — and the effect that creates one runs after
	 * the canvas already exists. Whichever happens second is the one that
	 * actually transfers.
	 */
	const tryAttachCanvas = useCallback(() => {
		const element = canvasRef.current
		const worker = workerRef.current
		if (!element || !worker || transferredRef.current) return

		// A second transfer of the same element throws InvalidStateError, which a
		// StrictMode or HMR remount would otherwise trigger.
		const offscreen = element.transferControlToOffscreen()
		transferredRef.current = true
		worker.postMessage(
			{ type: 'attach-preview', canvas: offscreen } satisfies ToWorker,
			[offscreen],
		)
	}, [])

	const attachCanvas = useCallback(
		(element: HTMLCanvasElement | null) => {
			canvasRef.current = element
			tryAttachCanvas()
		},
		[tryAttachCanvas],
	)

	useEffect(() => {
		const unsupported =
			typeof Worker === 'undefined' ||
			typeof OffscreenCanvas === 'undefined' ||
			typeof createImageBitmap === 'undefined'

		if (unsupported) {
			dispatch({ type: 'unsupported' })
			return
		}

		let worker: Worker
		try {
			// Vite only detects the worker when the `new URL()` is an inline
			// literal inside `new Worker()`, and its resolver wants the './'.
			// eslint-disable-next-line unicorn/relative-url-style -- see above
			worker = new Worker(new URL('./mosaic.worker.ts', import.meta.url), {
				type: 'module',
			})
		} catch {
			dispatch({ type: 'unsupported' })
			return
		}

		workerRef.current = worker

		const readyTimer = setTimeout(() => {
			dispatch({ type: 'unsupported' })
		}, READY_TIMEOUT_MS)

		// eslint-disable-next-line unicorn/prefer-add-event-listener -- one handler by design; replacing it is the intent
		worker.onmessage = (event: MessageEvent) => {
			const message = readMessage<FromWorker>(event)

			switch (message.type) {
				case 'ready': {
					clearTimeout(readyTimer)
					dispatch({ type: 'supported' })
					tryAttachCanvas()
					post({ type: 'probe-canvas' })
					return
				}
				case 'canvas-limit': {
					dispatch({ type: 'limits', maxArea: message.maxArea })
					return
				}
				case 'progress': {
					dispatch({
						type: 'progress',
						phase: message.phase,
						progress: message.total > 0 ? message.done / message.total : 0,
					})
					return
				}
				case 'tiles': {
					dispatch({
						type: 'tiles',
						total: message.total,
						considered: message.considered,
						added: message.total - tileCountRef.current,
						rejected: message.rejected,
					})
					tileCountRef.current = message.total
					return
				}
				case 'matched': {
					dispatch({ type: 'job', job: 'drawing' })
					post({
						type: 'render',
						jobId: jobIdRef.current,
						target: {
							kind: 'preview',
							width: PREVIEW_MAX_PX,
							height: PREVIEW_MAX_PX,
						},
						options: {
							jitterDeg: settingsRef.current.rotation,
							tint: settingsRef.current.tint,
							blackAndWhite: settingsRef.current.blackAndWhite,
							seed: seedRef.current,
						},
					})
					return
				}
				case 'rendered': {
					if (message.kind === 'export' && pendingExportRef.current) {
						dispatch({ type: 'job', job: 'encoding' })
						post({
							type: 'encode',
							jobId: jobIdRef.current,
							mime: pendingExportRef.current,
							quality: JPEG_QUALITY,
						})
						return
					}
					dispatch({ type: 'rendered' })
					return
				}
				case 'encoded': {
					revokeUrl()
					const url = URL.createObjectURL(message.blob)
					urlRef.current = url
					// Browsers silently fall back to PNG for a type they cannot
					// encode, so the extension has to come from what came back.
					const extension = message.blob.type === MIME_JPEG ? 'jpg' : 'png'
					dispatch({
						type: 'encoded',
						url,
						name: `mosaic-${message.width}x${message.height}.${extension}`,
					})
					return
				}
				case 'failed': {
					dispatch({ type: 'error', code: message.code })
					return
				}
				default: {
					return
				}
			}
		}

		post({ type: 'init' })

		// ClientRouter swaps the document on in-app navigation, and React cleanup
		// is not reliably invoked when it does — without this the worker keeps
		// running with the whole tile atlas pinned.
		function teardown() {
			if (debounceRef.current) clearTimeout(debounceRef.current)
			revokeUrl()
			workerRef.current?.postMessage({ type: 'dispose' } satisfies ToWorker)
			workerRef.current?.terminate()
			workerRef.current = null
			// Without this a re-run of this effect builds a new worker that never
			// receives a canvas, because the flag still says one was handed over.
			transferredRef.current = false
		}

		/**
		 * `pagehide` also fires when the page goes into the back/forward cache,
		 * where it will be resumed rather than reloaded — and this effect does not
		 * re-run on a bfcache restore. Tearing down there would leave the restored
		 * page looking ready while every message went nowhere, so only a real
		 * unload tears down.
		 */
		function handlePageHide(event: PageTransitionEvent) {
			if (!event.persisted) teardown()
		}

		document.addEventListener('astro:before-swap', teardown)
		window.addEventListener('pagehide', handlePageHide)

		return () => {
			clearTimeout(readyTimer)
			document.removeEventListener('astro:before-swap', teardown)
			window.removeEventListener('pagehide', handlePageHide)
			teardown()
		}
	}, [post, revokeUrl, tryAttachCanvas])

	const sendTarget = useCallback(
		(grid: Grid) => {
			const analysis = analysisRef.current
			if (!analysis) return

			// SIGNATURE_SOURCE_PX per cell, not SIGNATURE_GRID: tile signatures are
			// built by block-averaging a SIGNATURE_SOURCE_PX square in linear light,
			// so cells have to be sampled at the same resolution and averaged the
			// same way. Handing the worker one pixel per sub-cell instead would
			// leave tiles averaged linearly and cells averaged in gamma space by
			// the browser's downscale — tiles then read lighter than the cells they
			// are compared against, and the matcher systematically picks tiles that
			// are too dark.
			const sampleWidth = grid.cols * SIGNATURE_SOURCE_PX
			const sampleHeight = grid.rows * SIGNATURE_SOURCE_PX
			const sampler = document.createElement('canvas')
			sampler.width = sampleWidth
			sampler.height = sampleHeight
			const context = sampler.getContext('2d', { willReadFrequently: true })
			if (!context) return

			context.imageSmoothingEnabled = true
			context.imageSmoothingQuality = 'high'
			context.drawImage(analysis, 0, 0, sampleWidth, sampleHeight)
			const samples = context.getImageData(0, 0, sampleWidth, sampleHeight).data

			post(
				{
					type: 'set-target',
					jobId: jobIdRef.current,
					grid: { cols: grid.cols, rows: grid.rows, cellPx: grid.cellPx },
					samples,
				},
				[samples.buffer],
			)
		},
		[post],
	)

	const setMainImage = useCallback(async (file: File) => {
		const url = URL.createObjectURL(file)
		try {
			const image = new Image()
			image.src = url
			// drawImage(HTMLImageElement) honours EXIF orientation in every
			// engine; createImageBitmap does not on Safari <= 16.6, and a
			// sideways source would rotate the entire mosaic.
			await image.decode()

			analysisRef.current = downscaleStepwise(
				image,
				image.naturalWidth,
				image.naturalHeight,
				ANALYSIS_MAX_PX,
			)

			const analysis = analysisRef.current
			const grid = deriveGrid(
				analysis.width,
				analysis.height,
				settingsRef.current.columns,
				PREVIEW_MAX_PX,
			)
			dispatch({
				type: 'source',
				grid,
				width: analysis.width,
				height: analysis.height,
			})
		} catch {
			dispatch({ type: 'error', code: 'decode' })
		} finally {
			URL.revokeObjectURL(url)
		}
	}, [])

	const addPhotos = useCallback(
		(files: File[]) => {
			if (files.length === 0) return
			jobIdRef.current += 1
			dispatch({ type: 'ingest-start' })
			post({ type: 'add-tiles', jobId: jobIdRef.current, files })
		},
		[post],
	)

	const generate = useCallback(() => {
		const grid = gridRef.current
		if (!grid) return

		jobIdRef.current += 1
		seedRef.current = jobIdRef.current
		dispatch({ type: 'job', job: 'matching' })
		sendTarget(grid)
		post({
			type: 'match',
			jobId: jobIdRef.current,
			options: {
				spread: 1.5,
				blackAndWhite: settingsRef.current.blackAndWhite,
				seed: seedRef.current,
			},
		})
	}, [post, sendTarget])

	const rerender = useCallback(() => {
		jobIdRef.current += 1
		dispatch({ type: 'job', job: 'drawing' })
		post({
			type: 'render',
			jobId: jobIdRef.current,
			target: {
				kind: 'preview',
				width: PREVIEW_MAX_PX,
				height: PREVIEW_MAX_PX,
			},
			options: {
				jitterDeg: settingsRef.current.rotation,
				tint: settingsRef.current.tint,
				blackAndWhite: settingsRef.current.blackAndWhite,
				seed: seedRef.current,
			},
		})
	}, [post])

	/**
	 * Drops a finished export.
	 *
	 * Called when the chosen export size changes: the existing blob was encoded
	 * at the old dimensions, so leaving the link in place would hand the user a
	 * file that silently disagrees with the size they just picked.
	 */
	const clearExport = useCallback(() => {
		revokeUrl()
		dispatch({ type: 'export-cleared' })
	}, [revokeUrl])

	const updateSettings = useCallback(
		(patch: Partial<Settings>, invalidatesMatch: boolean) => {
			dispatch({ type: 'settings', patch, invalidatesMatch })

			// The finished export was encoded from the settings that just changed,
			// so the link would hand over a file that disagrees with the preview.
			clearExport()

			if (invalidatesMatch) {
				const analysis = analysisRef.current
				if (analysis && patch.columns !== undefined) {
					dispatch({
						type: 'grid',
						grid: deriveGrid(
							analysis.width,
							analysis.height,
							patch.columns,
							PREVIEW_MAX_PX,
						),
					})
				}
			}

			// Every control re-runs on its own; nothing waits for Generate to be
			// pressed again. Jitter and tint only need the O(1) draw passes, while
			// density and black-and-white change the assignment and so re-match —
			// leaving those silently stale (with the tint slider greying out and
			// nothing else happening) read as the tool being broken.
			if (debounceRef.current) clearTimeout(debounceRef.current)
			debounceRef.current = setTimeout(() => {
				if (!gridRef.current) return
				if (invalidatesMatch) generate()
				else rerender()
			}, RENDER_DEBOUNCE_MS)
		},
		[rerender, generate, clearExport],
	)

	const exportOptions = useMemo<ExportOption[]>(() => {
		if (!state.sourceReady) return []

		const sizes = EXPORT_EDGES.map((edge) => {
			const derived = deriveGrid(
				state.sourceWidth,
				state.sourceHeight,
				state.settings.columns,
				edge,
			)
			const area = derived.width * derived.height
			return {
				edge,
				width: derived.width,
				height: derived.height,
				cellPx: derived.cellPx,
				// The browser limit is on AREA, so a width that clears a square probe
				// does not mean a portrait export at that width clears it too.
				available: state.maxArea === null || area <= state.maxArea,
				nativeDetail: false,
			}
		})

		// Tiles are stored at TILE_PX, so past roughly that cell size they are
		// being upscaled and the extra pixels buy nothing. Mark the largest size
		// that still renders them at their own resolution, rather than marking
		// everything above it — the useful fact is where the detail stops.
		const lastCrisp = sizes.reduce(
			(best, size, index) =>
				size.cellPx <= NATIVE_DETAIL_CELL_PX ? index : best,
			-1,
		)
		if (lastCrisp >= 0) sizes[lastCrisp].nativeDetail = true

		return sizes
	}, [
		state.sourceReady,
		state.sourceWidth,
		state.sourceHeight,
		state.maxArea,
		state.settings.columns,
	])

	const exportAt = useCallback(
		(option: ExportOption) => {
			const area = option.width * option.height
			const mime = area > JPEG_THRESHOLD_AREA ? MIME_JPEG : MIME_PNG
			pendingExportRef.current = mime

			jobIdRef.current += 1
			dispatch({ type: 'job', job: 'drawing' })
			post({
				type: 'render',
				jobId: jobIdRef.current,
				target: {
					kind: 'export',
					width: option.width,
					height: option.height,
				},
				options: {
					jitterDeg: settingsRef.current.rotation,
					tint: settingsRef.current.tint,
					blackAndWhite: settingsRef.current.blackAndWhite,
					seed: seedRef.current,
				},
			})
		},
		[post],
	)

	const cancel = useCallback(() => {
		post({ type: 'cancel', jobId: jobIdRef.current })
		jobIdRef.current += 1
		dispatch({ type: 'job', job: 'idle' })
	}, [post])

	const isBusy =
		state.job === 'matching' ||
		state.job === 'drawing' ||
		state.job === 'encoding'

	return {
		state,
		exportOptions,
		isBusy,
		canGenerate: state.sourceReady && state.tileCount > 0 && !isBusy,
		canExport: state.job === 'done' && !state.renderDirty && !isBusy,
		attachCanvas,
		setMainImage,
		addPhotos,
		updateSettings,
		generate,
		cancel,
		exportAt,
		clearExport,
	}
}
