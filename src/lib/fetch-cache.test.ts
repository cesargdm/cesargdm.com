import { describe, expect, test } from 'bun:test'

import { cacheControl, ONE_DAY_SECONDS, ONE_HOUR_SECONDS } from './fetch-cache'

describe('cacheControl', () => {
	test('pins browsers to revalidate while the edge can HIT', () => {
		expect(cacheControl(ONE_DAY_SECONDS)).toBe(
			'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
		)
	})

	test('accepts a separate browser TTL for crawlers and OG images', () => {
		expect(cacheControl(ONE_DAY_SECONDS, ONE_HOUR_SECONDS)).toBe(
			'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
		)
	})
})
