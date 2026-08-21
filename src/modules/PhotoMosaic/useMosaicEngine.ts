import {
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from 'react'

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
	/** Decorative tilt, in degrees. */
	tilt: number
	/** Whether the matcher may turn photos in quarter turns to fit. */
	allowRotation: boolean
	blackAndWhite: boolean
}

type State = {
	supported: boolean | null
	sourceReady: boolean
	/** Analysis-canvas dimensions, so export sizes derive without touching a ref. */
	sourceWidth: number
	sourceHeight: number
	/** Object URL of the chosen main image, shown under the canvas as a guide. */
	sourcePreview: string | null
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
	| {
			type: 'source'
			grid: Grid
			width: number
			height: number
			preview: string
	  }
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
	| { type: 'error'; code: MosaicErrorCode; keepPreview: boolean }
	| { type: 'limits'; maxArea: number }
	| { type: 'export-cleared' }
	| { type: 'settings'; patch: Partial<Settings>; invalidatesMatch: boolean }

const INITIAL: State = {
	supported: null,
	sourceReady: false,
	sourceWidth: 0,
	sourceHeight: 0,
	sourcePreview: null,
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
		tilt: DEFAULT_ROTATION_DEGREES,
		allowRotation: true,
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
				sourcePreview: action.preview,
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
			// A failed export must not throw away a preview that is still valid.
			// The message tells the user to pick a smaller size, and dropping to
			// 'idle' would disable Download and make following that instruction
			// impossible without regenerating the whole mosaic first.
			return {
				...state,
				job: action.keepPreview ? 'done' : 'idle',
				phase: null,
				error: action.code,
			}
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
	// Bumped to remount the preview canvas when a rebuilt worker needs a fresh one.
	const [canvasKey, setCanvasKey] = useState(0)

	const workerRef = useRef<Worker | null>(null)
	const jobIdRef = useRef(0)
	const seedRef = useRef(1)
	const analysisRef = useRef<HTMLCanvasElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	/** The element whose control was handed over; a canvas allows that once, ever. */
	const transferredElementRef = useRef<HTMLCanvasElement | null>(null)
	const urlRef = useRef<string | null>(null)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const pendingExportRef = useRef<string | null>(null)
	const settingsRef = useRef(state.settings)
	const gridRef = useRef<Grid | null>(null)
	const tileCountRef = useRef(0)
	const matchDirtyRef = useRef(true)
	const jobRef = useRef<State['job']>('idle')
	const sourceTokenRef = useRef(0)
	const sourceUrlRef = useRef<string | null>(null)

	// Mirrored into refs rather than read from state inside the worker callbacks,
	// which close over the render they were created in. Updated in an effect, not
	// during render — every caller runs after commit, so there is no staleness.
	useEffect(() => {
		settingsRef.current = state.settings
		gridRef.current = state.grid
		matchDirtyRef.current = state.matchDirty
		jobRef.current = state.job
	}, [state.settings, state.grid, state.matchDirty, state.job])

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
	 * mount there is no worker yet — and the effect that creates one runs after the
	 * canvas already exists. Whichever happens second does the transfer.
	 */
	const tryAttachCanvas = useCallback(() => {
		const element = canvasRef.current
		const worker = workerRef.current
		if (!element || !worker) return

		if (transferredElementRef.current === element) {
			// `transferControlToOffscreen` may be called once per element for that
			// element's whole lifetime — a second call throws InvalidStateError, and
			// no flag reset can undo it. So when the worker is rebuilt (StrictMode's
			// double invoke, an HMR update) the old canvas cannot be handed to the new
			// one; React has to give us a new element first. Bumping the key remounts
			// it, and the fresh element arrives back here through the ref callback.
			setCanvasKey((key) => key + 1)
			return
		}

		const offscreen = element.transferControlToOffscreen()
		transferredElementRef.current = element
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
							jitterDeg: settingsRef.current.tilt,
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
						// convertToBlob gives no incremental progress, but leaving the
						// phase on 'draw' at 100% makes a multi-second encode of a large
						// export look like a hang.
						dispatch({ type: 'progress', phase: 'encode', progress: 0 })
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
					// A settings change during encoding already cleared the export and
					// started a new job. Accepting this would resurrect a link to a blob
					// encoded from the settings the user just moved away from.
					if (message.jobId !== jobIdRef.current) return
					revokeUrl()
					const url = URL.createObjectURL(message.blob)
					urlRef.current = url
					// Browsers silently fall back to PNG for a type they cannot
					// encode, so the extension has to come from what came back.
					const extension = message.blob.type === MIME_JPEG ? 'jpg' : 'png'
					const name = `mosaic-${message.width}x${message.height}.${extension}`

					// Save it now rather than swapping the button for a link and waiting
					// for a second click: the click that started this WAS the request to
					// download, and encoding a large export takes long enough that being
					// asked to ask again reads as the first click having failed.
					const link = document.createElement('a')
					link.href = url
					link.download = name
					link.rel = 'noopener'
					link.click()

					dispatch({ type: 'encoded', url, name })
					return
				}
				case 'failed': {
					// An export that fails leaves the previewed mosaic intact, so the
					// user can just choose a smaller size and try again.
					const wasExport = pendingExportRef.current !== null
					pendingExportRef.current = null
					dispatch({
						type: 'error',
						code: message.code,
						keepPreview: wasExport && jobRef.current !== 'idle',
					})
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
			if (sourceUrlRef.current) {
				URL.revokeObjectURL(sourceUrlRef.current)
				sourceUrlRef.current = null
			}
			workerRef.current?.postMessage({ type: 'dispose' } satisfies ToWorker)
			workerRef.current?.terminate()
			workerRef.current = null
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
		// Two picks in quick succession decode concurrently, and a slow first one
		// would otherwise overwrite the newer image after it already looked ready.
		sourceTokenRef.current += 1
		const token = sourceTokenRef.current
		// Not revoked in `finally` like a throwaway: this URL stays alive as the
		// placeholder shown under the canvas, so it is released on replacement
		// and on teardown instead.
		const url = URL.createObjectURL(file)
		try {
			const image = new Image()
			image.src = url
			// drawImage(HTMLImageElement) honours EXIF orientation in every
			// engine; createImageBitmap does not on Safari <= 16.6, and a
			// sideways source would rotate the entire mosaic.
			await image.decode()

			if (token !== sourceTokenRef.current) return

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
			if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current)
			sourceUrlRef.current = url

			dispatch({
				type: 'source',
				grid,
				width: analysis.width,
				height: analysis.height,
				preview: url,
			})
		} catch {
			URL.revokeObjectURL(url)
			dispatch({ type: 'error', code: 'decode', keepPreview: false })
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
				allowRotation: settingsRef.current.allowRotation,
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
				jitterDeg: settingsRef.current.tilt,
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
				// `invalidatesMatch` describes only this change. If the assignment was
				// already stale — a new main image, more tiles — a plain redraw would
				// paint the old assignment and then clear the dirty flags, quietly
				// making that stale mosaic exportable.
				if (invalidatesMatch || matchDirtyRef.current) generate()
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
					jitterDeg: settingsRef.current.tilt,
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

	// Ingestion counts: the library is still being mutated, so matching now would
	// use whatever subset had decoded, and an in-flight ingest finishing first
	// would clear the dirty flags and present that partial result as current.
	const isBusy =
		state.ingesting ||
		state.job === 'matching' ||
		state.job === 'drawing' ||
		state.job === 'encoding'

	return {
		state,
		canvasKey,
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
