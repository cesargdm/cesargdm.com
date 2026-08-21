/* eslint-disable no-bitwise -- binary container parsing: combining LE byte
   triples and masking bit-packed WebP dimension fields both require it. */
/* eslint-disable unicorn/number-literal-case -- oxfmt normalises hex literals
   to lowercase digits, which fights this rule's uppercase preference; defer
   to the formatter. */

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

function bytesStartWith(
	bytes: Uint8Array,
	offset: number,
	text: string,
): boolean {
	if (offset < 0 || offset + text.length > bytes.length) return false
	for (let i = 0; i < text.length; i++) {
		if (bytes[offset + i] !== text.charCodeAt(i)) return false
	}
	return true
}

function readUint16(
	bytes: Uint8Array,
	offset: number,
	littleEndian: boolean,
): number | null {
	if (offset < 0 || offset + 2 > bytes.length) return null
	return new DataView(
		bytes.buffer,
		bytes.byteOffset,
		bytes.byteLength,
	).getUint16(offset, littleEndian)
}

function readUint32(
	bytes: Uint8Array,
	offset: number,
	littleEndian: boolean,
): number | null {
	if (offset < 0 || offset + 4 > bytes.length) return null
	return new DataView(
		bytes.buffer,
		bytes.byteOffset,
		bytes.byteLength,
	).getUint32(offset, littleEndian)
}

function readUint24LE(bytes: Uint8Array, offset: number): number | null {
	if (offset < 0 || offset + 3 > bytes.length) return null
	return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16)
}

const PNG_SIGNATURE = '\x89PNG\r\n\x1a\n'
const PNG_WIDTH_OFFSET = 16
const PNG_HEIGHT_OFFSET = 20

function readPngSize(bytes: Uint8Array): ImageSize | null {
	if (!bytesStartWith(bytes, 0, PNG_SIGNATURE)) return null

	const width = readUint32(bytes, PNG_WIDTH_OFFSET, false)
	const height = readUint32(bytes, PNG_HEIGHT_OFFSET, false)
	if (width === null || height === null) return null

	return { width, height }
}

const JPEG_MARKER_PREFIX = 0xff
const JPEG_SOI = 0xd8
const JPEG_EOI = 0xd9
const JPEG_SOF_MIN = 0xc0
const JPEG_SOF_MAX = 0xcf
const JPEG_DHT = 0xc4
const JPEG_JPG_RESERVED = 0xc8
const JPEG_DAC = 0xcc
const JPEG_HEADER_BYTES = 4
const JPEG_SOF_HEIGHT_OFFSET = 5
const JPEG_SOF_WIDTH_OFFSET = 7

function isSofMarker(code: number): boolean {
	if (code < JPEG_SOF_MIN || code > JPEG_SOF_MAX) return false
	return code !== JPEG_DHT && code !== JPEG_JPG_RESERVED && code !== JPEG_DAC
}

function readJpegSize(bytes: Uint8Array): ImageSize | null {
	if (bytes.length < JPEG_HEADER_BYTES) return null
	if (bytes[0] !== JPEG_MARKER_PREFIX || bytes[1] !== JPEG_SOI) return null

	let offset = 2
	while (offset + JPEG_HEADER_BYTES <= bytes.length) {
		if (bytes[offset] !== JPEG_MARKER_PREFIX) return null

		const code = bytes[offset + 1]
		if (code === JPEG_SOI || code === JPEG_EOI) return null

		if (isSofMarker(code)) {
			const height = readUint16(bytes, offset + JPEG_SOF_HEIGHT_OFFSET, false)
			const width = readUint16(bytes, offset + JPEG_SOF_WIDTH_OFFSET, false)
			if (height === null || width === null) return null
			return { width, height }
		}

		const length = readUint16(bytes, offset + 2, false)
		if (length === null || length < 2) return null
		offset += 2 + length
	}

	return null
}

const GIF_HEADER_87A = 'GIF87a'
const GIF_HEADER_89A = 'GIF89a'
const GIF_WIDTH_OFFSET = 6
const GIF_HEIGHT_OFFSET = 8

function readGifSize(bytes: Uint8Array): ImageSize | null {
	const isGif =
		bytesStartWith(bytes, 0, GIF_HEADER_87A) ||
		bytesStartWith(bytes, 0, GIF_HEADER_89A)
	if (!isGif) return null

	const width = readUint16(bytes, GIF_WIDTH_OFFSET, true)
	const height = readUint16(bytes, GIF_HEIGHT_OFFSET, true)
	if (width === null || height === null) return null

	return { width, height }
}

const RIFF_TAG = 'RIFF'
const WEBP_TAG = 'WEBP'
const WEBP_TAG_OFFSET = 8
const WEBP_CHUNK_TYPE_OFFSET = 12
const WEBP_VP8_LOSSY_TAG = 'VP8 '
const WEBP_VP8_LOSSLESS_TAG = 'VP8L'
const WEBP_VP8_EXTENDED_TAG = 'VP8X'
const WEBP_LOSSY_DIMS_OFFSET = 26
const WEBP_LOSSLESS_PACKED_OFFSET = 21
const WEBP_EXTENDED_WIDTH_OFFSET = 24
const WEBP_EXTENDED_HEIGHT_OFFSET = 27
const WEBP_DIM_MASK_14BIT = 0x3fff
const WEBP_LOSSLESS_HEIGHT_SHIFT = 14

function readWebpSize(bytes: Uint8Array): ImageSize | null {
	if (!bytesStartWith(bytes, 0, RIFF_TAG)) return null
	if (!bytesStartWith(bytes, WEBP_TAG_OFFSET, WEBP_TAG)) return null

	if (bytesStartWith(bytes, WEBP_CHUNK_TYPE_OFFSET, WEBP_VP8_LOSSY_TAG)) {
		const width = readUint16(bytes, WEBP_LOSSY_DIMS_OFFSET, true)
		const height = readUint16(bytes, WEBP_LOSSY_DIMS_OFFSET + 2, true)
		if (width === null || height === null) return null
		return {
			width: width & WEBP_DIM_MASK_14BIT,
			height: height & WEBP_DIM_MASK_14BIT,
		}
	}

	if (bytesStartWith(bytes, WEBP_CHUNK_TYPE_OFFSET, WEBP_VP8_LOSSLESS_TAG)) {
		const packed = readUint32(bytes, WEBP_LOSSLESS_PACKED_OFFSET, true)
		if (packed === null) return null
		const width = (packed & WEBP_DIM_MASK_14BIT) + 1
		const height =
			((packed >>> WEBP_LOSSLESS_HEIGHT_SHIFT) & WEBP_DIM_MASK_14BIT) + 1
		return { width, height }
	}

	if (bytesStartWith(bytes, WEBP_CHUNK_TYPE_OFFSET, WEBP_VP8_EXTENDED_TAG)) {
		const width = readUint24LE(bytes, WEBP_EXTENDED_WIDTH_OFFSET)
		const height = readUint24LE(bytes, WEBP_EXTENDED_HEIGHT_OFFSET)
		if (width === null || height === null) return null
		return { width: width + 1, height: height + 1 }
	}

	return null
}

/**
 * Parses PNG, JPEG, WebP (VP8 / VP8L / VP8X) and GIF headers.
 *
 * Returns null for an unrecognised container, and for truncated or malformed
 * input — callers fall back to a full decode. Must never throw on garbage.
 */
export function readImageSize(bytes: Uint8Array): ImageSize | null {
	try {
		return (
			readPngSize(bytes) ??
			readJpegSize(bytes) ??
			readGifSize(bytes) ??
			readWebpSize(bytes) ??
			null
		)
	} catch {
		return null
	}
}
