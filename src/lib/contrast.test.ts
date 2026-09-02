import { describe, expect, test } from 'bun:test'

import {
	getContrastingInk,
	getRelativeLuminance,
	INK_DARK,
	INK_LIGHT,
} from './contrast'

describe('the ink constants', () => {
	// Imported rather than restated so the cases below read as "the light one"
	// instead of a hex — but something still has to pin the hexes themselves,
	// since they are hand-copied from a `.css.ts` that cannot be imported here
	// (vanilla-extract needs its Vite plugin, which `bun test` does not run).
	test('match the theme `text.regular` tokens', () => {
		expect(INK_DARK).toBe('#111318')
		expect(INK_LIGHT).toBe('#F5F7FA')
	})
})

describe('getContrastingInk', () => {
	test('picks light ink on the dark project backgrounds', () => {
		// TOLO's green — dark theme ink would be unreadable here in light mode.
		expect(getContrastingInk('#3D6039')).toBe(INK_LIGHT)
		expect(getContrastingInk('#000000')).toBe(INK_LIGHT)
	})

	test('picks dark ink on the light project backgrounds', () => {
		// Cretia's grey — light theme ink would be unreadable here in dark mode.
		expect(getContrastingInk('#dddddd')).toBe(INK_DARK)
		expect(getContrastingInk('#E86DAE')).toBe(INK_DARK)
		expect(getContrastingInk('#ffffff')).toBe(INK_DARK)
	})

	test('accepts shorthand hex and a missing hash', () => {
		expect(getContrastingInk('#ddd')).toBe(INK_DARK)
		expect(getContrastingInk('3D6039')).toBe(INK_LIGHT)
	})

	test('falls back to the inherited ink for unparseable colours', () => {
		expect(getContrastingInk('rebeccapurple')).toBeUndefined()
		expect(getContrastingInk('')).toBeUndefined()
	})
})

describe('getRelativeLuminance', () => {
	test('spans black to white', () => {
		expect(getRelativeLuminance('#000000')).toBe(0)
		expect(getRelativeLuminance('#ffffff')).toBeCloseTo(1)
	})
})
