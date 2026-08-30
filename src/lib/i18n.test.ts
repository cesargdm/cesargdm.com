import { describe, expect, test } from 'bun:test'

import { withLocalePrefix } from './i18n'

describe('withLocalePrefix', () => {
	test('maps the bare origin to /en, not /en/', () => {
		expect(withLocalePrefix('en', '/')).toBe('/en')
		expect(withLocalePrefix('es', '/')).toBe('/es')
	})

	test('keeps nested paths and the query string', () => {
		expect(withLocalePrefix('en', '/blog', '?q=astro')).toBe('/en/blog?q=astro')
		expect(withLocalePrefix('es', '/projects/tolo')).toBe('/es/projects/tolo')
	})
})
