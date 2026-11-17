import { expect, test } from 'bun:test'

import { getCheerFromVisitsCount } from '@/lib/cheer'

test('picks the cheer for each visit band, per locale', () => {
	expect(getCheerFromVisitsCount('1', 'en')).toBe('again')
	expect(getCheerFromVisitsCount('2', 'es')).toBe('de nuevo')
	expect(getCheerFromVisitsCount('3', 'en')).toBe('buddy')
	expect(getCheerFromVisitsCount('50', 'es')).toBe('mamá')
	expect(getCheerFromVisitsCount('51', 'en')).toBe('debugger')
	expect(getCheerFromVisitsCount('garbage', 'en')).toBe('debugger')
})
