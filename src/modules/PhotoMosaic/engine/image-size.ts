/**
 * Reads image dimensions from a container header, without decoding.
 *
 * This is what makes single-decode ingestion possible: knowing the dimensions up
 * front lets the centre-crop rectangle be passed to `createImageBitmap` on the
 * first and only decode. On Safari <= 16.6, where the resize options dict is
 * ignored but the crop-rect form still works, that is the difference between
 * retaining a 3000x3000 crop and the whole 4000x3000 frame.
 *
 * Pure: takes bytes, not a Blob, so `bun test` can exercise it with fixtures.
 */

export type ImageSize = { width: number; height: number }

/**
 * Parses PNG, JPEG, WebP (VP8 / VP8L / VP8X) and GIF headers.
 *
 * Returns null for an unrecognised container, and for truncated or malformed
 * input — callers fall back to a full decode. Must never throw on garbage.
 */
export function readImageSize(bytes: Uint8Array): ImageSize | null {
	throw new Error('unimplemented')
}
