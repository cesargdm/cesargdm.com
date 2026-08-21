/**
 * The wire format between the PhotoMosaic island and its worker.
 *
 * This file must import nothing. Vite's `worker.plugins` defaults to `() => []`,
 * so vanilla-extract and Lingui do not run for the worker bundle — anything that
 * reaches a `.css.ts` or a `.po` from here breaks the build in a confusing way.
 */

export const PHASES = ['ingest', 'match', 'draw', 'encode'] as const

export type MosaicPhase = (typeof PHASES)[number]

export const MOSAIC_ERRORS = [
	'unsupported',
	'decode',
	'memory',
	'no-tiles',
	'no-target',
	'canvas-blank',
	'unknown',
] as const

export type MosaicErrorCode = (typeof MOSAIC_ERRORS)[number]

export const REJECT_REASONS = [
	'decode',
	'too-large',
	'duplicate',
	'over-cap',
] as const

export type RejectReason = (typeof REJECT_REASONS)[number]

export type RejectedFile = { name: string; reason: RejectReason }

/** What the browser turned out to support, probed once at worker start. */
export type EngineCaps = {
	/** `createImageBitmap` honours the options dict. False on Safari <= 16.6. */
	resizeImageBitmap: boolean
	/** Non-separable `globalCompositeOperation` values ('color', 'saturation'). */
	blendModes: boolean
}

export type GridSpec = {
	cols: number
	rows: number
	/**
	 * Output pixels per cell. `outW = cols * cellPx` exactly, so cells tile the
	 * canvas with no fractional boundaries and therefore no hairline seams.
	 */
	cellPx: number
}

export type MatchOptions = {
	/** Multiplier over the mean use count; > 1 guarantees the library cannot run dry. */
	spread: number
	blackAndWhite: boolean
	/**
	 * Let the matcher place a photo in quarter turns.
	 *
	 * Rotating a signature is an index permutation, so this gives it four times
	 * as many candidates without decoding anything again — a photo whose shapes
	 * run the wrong way for a cell can still fit it turned.
	 */
	allowRotation: boolean
	seed: number
}

export type RenderOptions = {
	/** Maximum absolute rotation per tile, in degrees. */
	jitterDeg: number
	/** 0..1, applied as `globalAlpha` under the 'color' blend. */
	tint: number
	blackAndWhite: boolean
	/** Shared by preview and export so the download matches what was previewed. */
	seed: number
}

export type RenderTarget = {
	kind: 'preview' | 'export'
	width: number
	height: number
}

export type ToWorker =
	| { type: 'init' }
	| { type: 'attach-preview'; canvas: OffscreenCanvas }
	| { type: 'probe-canvas' }
	| { type: 'add-tiles'; jobId: number; files: File[] }
	| { type: 'clear-tiles' }
	| {
			type: 'set-target'
			jobId: number
			grid: GridSpec
			samples: Uint8ClampedArray
	  }
	| { type: 'match'; jobId: number; options: MatchOptions }
	| {
			type: 'render'
			jobId: number
			target: RenderTarget
			options: RenderOptions
	  }
	| { type: 'encode'; jobId: number; mime: string; quality: number }
	| { type: 'cancel'; jobId: number }
	| { type: 'dispose' }

export type FromWorker =
	| { type: 'ready'; caps: EngineCaps }
	| { type: 'canvas-limit'; maxArea: number }
	| {
			type: 'progress'
			jobId: number
			phase: MosaicPhase
			done: number
			total: number
	  }
	| {
			type: 'tiles'
			jobId: number
			total: number
			considered: number
			rejected: RejectedFile[]
	  }
	| { type: 'matched'; jobId: number; distinctTiles: number }
	| { type: 'rendered'; jobId: number; kind: RenderTarget['kind']; ms: number }
	| {
			type: 'encoded'
			jobId: number
			blob: Blob
			width: number
			height: number
	  }
	| { type: 'cancelled'; jobId: number }
	| { type: 'failed'; jobId: number; code: MosaicErrorCode; detail?: string }

/**
 * `MessageEvent.data` is `any`, which the type-checked lint rules reject at every
 * call site. Keep the cast here, for the same reason `src/lib/json.ts` exists.
 */
// The single use of T is the point: callers name the type they expect back.
// eslint-disable-next-line typescript/no-unnecessary-type-parameters -- see above
export function readMessage<T>(event: MessageEvent): T {
	return event.data as T
}
