import type { GridSpec, RenderOptions } from '../protocol'

import {
	BLEED_PX,
	DRAW_YIELD_INTERVAL,
	NEUTRAL_GREY,
	SIGNATURE_SOURCE_PX,
	TILE_PX,
} from './constants'
import { coverFactor, mulberry32 } from './layout'
import type { TileLibrary } from './tiles'

/**
 * Draws the mosaic in four passes.
 *
 * Pass 1 places the tiles. Passes 2-4 are O(1) draw calls, so moving a slider
 * re-runs only the expensive pass. Preview and export call this with the same
 * seed and different dimensions, so the download matches what was previewed.
 */

const RGBA_CHANNELS = 4
const OPAQUE_ALPHA = 255

/** Rec.601 luma, for the no-blend-modes desaturation fallback. */
const LUMA_R = 0.299
const LUMA_G = 0.587
const LUMA_B = 0.114

/** Without the 'color' blend, a translucent fill washes the mosaic out past this. */
const FALLBACK_TINT_ALPHA_CAP = 0.6

function desaturateInPlace(
	ctx: OffscreenCanvasRenderingContext2D,
	width: number,
	height: number,
): void {
	const imageData = ctx.getImageData(0, 0, width, height)
	const data = imageData.data

	for (let i = 0; i < data.length; i += RGBA_CHANNELS) {
		const luma = LUMA_R * data[i] + LUMA_G * data[i + 1] + LUMA_B * data[i + 2]
		data[i] = luma
		data[i + 1] = luma
		data[i + 2] = luma
	}

	ctx.putImageData(imageData, 0, 0)
}

/**
 * A `cols` x `rows` canvas holding the mean colour of each cell's sample block,
 * for the tint pass to upscale in a single `drawImage`.
 */
function buildCellColorCanvas(
	samples: Uint8ClampedArray,
	cols: number,
	rows: number,
): OffscreenCanvas {
	const sampleWidth = cols * SIGNATURE_SOURCE_PX
	const samplesPerCell = SIGNATURE_SOURCE_PX * SIGNATURE_SOURCE_PX
	const imageData = new ImageData(cols, rows)
	const data = imageData.data

	for (let cellRow = 0; cellRow < rows; cellRow++) {
		for (let cellCol = 0; cellCol < cols; cellCol++) {
			let rSum = 0
			let gSum = 0
			let bSum = 0

			for (let dy = 0; dy < SIGNATURE_SOURCE_PX; dy++) {
				const sy = cellRow * SIGNATURE_SOURCE_PX + dy
				for (let dx = 0; dx < SIGNATURE_SOURCE_PX; dx++) {
					const sx = cellCol * SIGNATURE_SOURCE_PX + dx
					const srcIndex = (sy * sampleWidth + sx) * RGBA_CHANNELS
					rSum += samples[srcIndex]
					gSum += samples[srcIndex + 1]
					bSum += samples[srcIndex + 2]
				}
			}

			const dstIndex = (cellRow * cols + cellCol) * RGBA_CHANNELS
			data[dstIndex] = rSum / samplesPerCell
			data[dstIndex + 1] = gSum / samplesPerCell
			data[dstIndex + 2] = bSum / samplesPerCell
			data[dstIndex + 3] = OPAQUE_ALPHA
		}
	}

	const canvas = new OffscreenCanvas(cols, rows)
	const ctx = canvas.getContext('2d')
	if (!ctx) throw new Error('2d context unavailable')
	ctx.putImageData(imageData, 0, 0)

	return canvas
}

export type RenderCaps = { blendModes: boolean }

/**
 * Generator so the worker can yield to its event loop between chunks — a
 * synchronous loop can never observe an inbound `cancel`, because the message
 * queues behind the running task. Yields the number of cells drawn so far.
 */
export function* renderMosaic(
	canvas: OffscreenCanvas,
	library: TileLibrary,
	/** cols * rows tile indices, row-major. */
	assignment: Int32Array,
	grid: GridSpec,
	/** (cols * SIGNATURE_SOURCE_PX) square blocks of RGBA target colour. */
	samples: Uint8ClampedArray,
	options: RenderOptions,
	caps: RenderCaps,
): Generator<number, void, void> {
	const ctx = canvas.getContext('2d', { alpha: false })
	if (!ctx) throw new Error('2d context unavailable')

	ctx.imageSmoothingQuality = 'high'

	const jitterRad = (options.jitterDeg * Math.PI) / 180
	const cellCount = grid.cols * grid.rows

	// Decided once, not per cell: the rotated branch leaves its transform set for
	// the rest of the pass (resetting 10,000 times is a real cost), so an
	// unrotated draw mixed in among rotated ones would inherit the previous
	// cell's matrix and land in the wrong place. Either every cell rotates or
	// none does, and the single reset below closes the pass.
	const rotates = jitterRad !== 0

	for (let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
		const cellCol = cellIndex % grid.cols
		const cellRow = Math.floor(cellIndex / grid.cols)
		const x0 = cellCol * grid.cellPx
		const y0 = cellRow * grid.cellPx
		const slot = library.slotOf(assignment[cellIndex])

		if (!rotates) {
			ctx.drawImage(
				slot.page,
				slot.sx,
				slot.sy,
				TILE_PX,
				TILE_PX,
				x0,
				y0,
				grid.cellPx,
				grid.cellPx,
			)
		} else {
			// eslint-disable-next-line no-bitwise -- mulberry32 seed mixing, per cell
			const rng = mulberry32(options.seed ^ cellIndex)
			const theta = (rng() * 2 - 1) * jitterRad
			const side = Math.ceil(grid.cellPx * coverFactor(theta)) + BLEED_PX
			const cos = Math.cos(theta)
			const sin = Math.sin(theta)
			const half = side / 2
			// The transform set here stays live for every remaining cell in this
			// pass — it is reset exactly once, after the loop, not per cell.
			ctx.setTransform(
				cos,
				sin,
				-sin,
				cos,
				x0 + grid.cellPx / 2,
				y0 + grid.cellPx / 2,
			)
			ctx.drawImage(
				slot.page,
				slot.sx,
				slot.sy,
				TILE_PX,
				TILE_PX,
				-half,
				-half,
				side,
				side,
			)
		}

		if ((cellIndex + 1) % DRAW_YIELD_INTERVAL === 0) yield cellIndex + 1
	}

	ctx.setTransform(1, 0, 0, 1, 0, 0)
	yield cellCount

	if (options.blackAndWhite) {
		if (caps.blendModes) {
			ctx.globalCompositeOperation = 'saturation'
			ctx.fillStyle = NEUTRAL_GREY
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			ctx.globalCompositeOperation = 'source-over'
		} else {
			desaturateInPlace(ctx, canvas.width, canvas.height)
		}
	}

	// Skipped entirely in black-and-white mode. The tint pass takes hue and
	// chroma from the source and luminosity from the backdrop, so running it
	// after the desaturation pass would put the colour straight back and a box
	// labelled "black and white" would produce a pastel image instead.
	if (options.tint > 0 && !options.blackAndWhite) {
		const tintCanvas = buildCellColorCanvas(samples, grid.cols, grid.rows)

		if (caps.blendModes) {
			ctx.globalCompositeOperation = 'color'
			ctx.globalAlpha = options.tint
		} else {
			ctx.globalCompositeOperation = 'source-over'
			ctx.globalAlpha = Math.min(options.tint, FALLBACK_TINT_ALPHA_CAP)
		}

		ctx.imageSmoothingEnabled = false
		ctx.drawImage(tintCanvas, 0, 0, canvas.width, canvas.height)
		ctx.imageSmoothingEnabled = true
	}

	ctx.globalCompositeOperation = 'source-over'
	ctx.globalAlpha = 1
	ctx.imageSmoothingEnabled = true
}
