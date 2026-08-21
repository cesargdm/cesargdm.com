import { describe, expect, test } from 'bun:test'

import { readImageSize } from './image-size'

function asciiBytes(text: string): number[] {
	return Array.from(text, (char) => char.charCodeAt(0))
}

function buildPng(width: number, height: number): Uint8Array {
	const bytes = new Uint8Array(24)
	const view = new DataView(bytes.buffer)
	bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0)
	view.setUint32(8, 13, false) // IHDR chunk data length
	bytes.set(asciiBytes('IHDR'), 12)
	view.setUint32(16, width, false)
	view.setUint32(20, height, false)
	return bytes
}

function buildJpeg(width: number, height: number): Uint8Array {
	// SOI, then an APP0 segment that must be skipped, then SOF0 with the dims.
	const appPayloadLength = 16 // includes the 2 length bytes themselves
	const sofStart = 4 + appPayloadLength
	const bytes = new Uint8Array(sofStart + 9)
	const view = new DataView(bytes.buffer)

	bytes[0] = 0xff
	bytes[1] = 0xd8 // SOI
	bytes[2] = 0xff
	bytes[3] = 0xe0 // APP0
	view.setUint16(4, appPayloadLength, false)
	bytes.set(asciiBytes('JFIF'), 6) // arbitrary payload bytes

	bytes[sofStart] = 0xff
	bytes[sofStart + 1] = 0xc0 // SOF0
	view.setUint16(sofStart + 2, 17, false) // segment length, unused by the parser
	bytes[sofStart + 4] = 8 // precision
	view.setUint16(sofStart + 5, height, false)
	view.setUint16(sofStart + 7, width, false)
	return bytes
}

function buildGif(width: number, height: number): Uint8Array {
	const bytes = new Uint8Array(10)
	bytes.set(asciiBytes('GIF89a'), 0)
	const view = new DataView(bytes.buffer)
	view.setUint16(6, width, true)
	view.setUint16(8, height, true)
	return bytes
}

function buildWebpVp8x(width: number, height: number): Uint8Array {
	const bytes = new Uint8Array(30)
	const view = new DataView(bytes.buffer)
	bytes.set(asciiBytes('RIFF'), 0)
	view.setUint32(4, 22, true) // RIFF size, unused by the parser
	bytes.set(asciiBytes('WEBP'), 8)
	bytes.set(asciiBytes('VP8X'), 12)
	view.setUint32(16, 10, true) // chunk size, unused by the parser
	// bytes 20 (flags) and 21-23 (reserved) are left zero.

	const widthLess1 = width - 1
	const heightLess1 = height - 1
	bytes[24] = widthLess1 & 0xff
	bytes[25] = (widthLess1 >> 8) & 0xff
	bytes[26] = (widthLess1 >> 16) & 0xff
	bytes[27] = heightLess1 & 0xff
	bytes[28] = (heightLess1 >> 8) & 0xff
	bytes[29] = (heightLess1 >> 16) & 0xff
	return bytes
}

describe('readImageSize', () => {
	test('parses a PNG header exactly', () => {
		expect(readImageSize(buildPng(1234, 567))).toEqual({
			width: 1234,
			height: 567,
		})
	})

	test('parses the real repo avatar as 512x512', async () => {
		const buffer = await Bun.file(
			new URL('../../../assets/avatar.png', import.meta.url),
		).arrayBuffer()
		expect(readImageSize(new Uint8Array(buffer))).toEqual({
			width: 512,
			height: 512,
		})
	})

	test('parses a JPEG header, skipping the APP0 segment correctly', () => {
		expect(readImageSize(buildJpeg(800, 600))).toEqual({
			width: 800,
			height: 600,
		})
	})

	test('parses a GIF header', () => {
		expect(readImageSize(buildGif(320, 240))).toEqual({
			width: 320,
			height: 240,
		})
	})

	test('parses a WebP VP8X (extended) header', () => {
		expect(readImageSize(buildWebpVp8x(1920, 1080))).toEqual({
			width: 1920,
			height: 1080,
		})
	})

	describe('returns null, never throws, on unrecognised or malformed input', () => {
		test('empty array', () => {
			const bytes = new Uint8Array(0)
			expect(() => readImageSize(bytes)).not.toThrow()
			expect(readImageSize(bytes)).toBeNull()
		})

		test('a handful of arbitrary bytes', () => {
			const bytes = new Uint8Array([1, 2, 3])
			expect(() => readImageSize(bytes)).not.toThrow()
			expect(readImageSize(bytes)).toBeNull()
		})

		test('a valid PNG signature truncated before IHDR', () => {
			const bytes = buildPng(100, 100).slice(0, 8)
			expect(() => readImageSize(bytes)).not.toThrow()
			expect(readImageSize(bytes)).toBeNull()
		})

		test('a RIFF/WEBP header with an unrecognised chunk type', () => {
			const bytes = new Uint8Array(16)
			bytes.set(asciiBytes('RIFF'), 0)
			bytes.set(asciiBytes('WEBP'), 8)
			bytes.set(asciiBytes('XXXX'), 12)
			expect(() => readImageSize(bytes)).not.toThrow()
			expect(readImageSize(bytes)).toBeNull()
		})

		test('random bytes matching no known container', () => {
			const bytes = new Uint8Array(64)
			for (let i = 0; i < bytes.length; i++) {
				bytes[i] = (i * 37 + 11) % 256
			}
			expect(() => readImageSize(bytes)).not.toThrow()
			expect(readImageSize(bytes)).toBeNull()
		})
	})
})
