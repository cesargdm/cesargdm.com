import { describe, expect, test } from 'bun:test'

import { getContrastingInk, getRelativeLuminance } from './contrast'

const INK_DARK = '#111318'
const INK_LIGHT = '#F5F7FA'

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
