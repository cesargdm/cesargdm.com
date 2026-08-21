/**
 * Runtime capability probes.
 *
 * Everything here answers a question the browser will not answer honestly by
 * feature detection alone: Safari ignores the `createImageBitmap` options dict
 * rather than throwing, silently ignores unsupported blend modes, and hands back
 * an over-limit canvas that allocates fine but stays blank.
 */

import { CANDIDATE_AREAS } from './constants'

const RESIZE_PROBE_SOURCE_PX = 4
const RESIZE_PROBE_TARGET_PX = 2

/** A colour whose channels are all distinguishable from an unwritten (blank) pixel. */
const PROBE_FILL = 'rgb(200, 40, 90)'
const PROBE_CHANNEL = 200

function paintsCorrectly(
	canvas: OffscreenCanvas,
	x: number,
	y: number,
): boolean {
	const context = canvas.getContext('2d', { alpha: false })
	if (!context) return false

	context.fillStyle = PROBE_FILL
	context.fillRect(x, y, 1, 1)

	const { data } = context.getImageData(x, y, 1, 1)
	return data[0] === PROBE_CHANNEL
}

function releaseCanvas(canvas: OffscreenCanvas): void {
	canvas.width = 0
	canvas.height = 0
}

function probeAreaOnce(area: number): boolean {
	const side = Math.floor(Math.sqrt(area))
	const canvas = new OffscreenCanvas(side, side)
	try {
		return paintsCorrectly(canvas, side - 1, side - 1)
	} finally {
		releaseCanvas(canvas)
	}
}

function probeAreaWithRetry(area: number): boolean {
	try {
		return probeAreaOnce(area)
	} catch {
		try {
			return probeAreaOnce(area)
		} catch {
			return false
		}
	}
}

/**
 * Whether `createImageBitmap` honours `resizeWidth` / `resizeHeight`.
 *
 * Not detectable by property sniffing — Safari <= 16.6 accepts the dict and
 * ignores it, so the only way to know is to resize something and measure.
 */
export async function detectResizeSupport(): Promise<boolean> {
	try {
		const bitmap = await createImageBitmap(
			new ImageData(RESIZE_PROBE_SOURCE_PX, RESIZE_PROBE_SOURCE_PX),
			{
				resizeWidth: RESIZE_PROBE_TARGET_PX,
				resizeHeight: RESIZE_PROBE_TARGET_PX,
				resizeQuality: 'pixelated',
			},
		)
		const supported = bitmap.width === RESIZE_PROBE_TARGET_PX
		bitmap.close()
		return supported
	} catch {
		return false
	}
}

/**
 * Whether non-separable blend modes ('color', 'saturation') are available.
 *
 * An unsupported `globalCompositeOperation` value is silently ignored rather
 * than throwing, so assign and read back.
 */
export function detectBlendModes(
	context: OffscreenCanvasRenderingContext2D,
): boolean {
	const previous = context.globalCompositeOperation
	context.globalCompositeOperation = 'color'
	const applied = context.globalCompositeOperation === 'color'
	context.globalCompositeOperation = previous
	return applied
}

/**
 * The largest canvas AREA this browser will actually paint, in pixels.
 *
 * Walks CANDIDATE_AREAS ascending and stops at the first failure. Ascending
 * matters: probing the largest first is a ~268MB allocation that can kill the
 * tab on a phone before it has learned anything.
 *
 * A thrown exception is treated as transient memory pressure and retried once;
 * only a blank read-back proves a real browser limit.
 */
export function probeMaxCanvasArea(): number {
	// Seeded with the smallest rung rather than 0, deliberately: if even that
	// fails there is no size worth offering, and reporting 0 would empty the
	// export menu and leave the tool looking broken. Reporting the smallest is
	// optimistic, so `probeExactCanvas` still gates the actual export and turns
	// a wrong guess into a clear message instead of a blank file.
	let lastPassing = CANDIDATE_AREAS[0]

	for (const area of CANDIDATE_AREAS) {
		if (!probeAreaWithRetry(area)) return lastPassing
		lastPassing = area
	}

	return lastPassing
}

/**
 * Whether a canvas of exactly these dimensions paints.
 *
 * Required before every export. The limit is on AREA and the probe ladder's
 * values sit exactly at Safari's caps, so a square probe passing does not
 * license a non-square export at the same width — a 3:4 image at 4096 wide is
 * 22.4M px against a 16.7M cap, and the failure is a valid but EMPTY file.
 */
export function probeExactCanvas(width: number, height: number): boolean {
	const canvas = new OffscreenCanvas(width, height)
	try {
		return paintsCorrectly(canvas, width - 1, height - 1)
	} catch {
		return false
	} finally {
		releaseCanvas(canvas)
	}
}
