import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { CONTENT_SECURITY_POLICY } from '@/lib/content-security-policy'

const HEADERS_PATH = join(import.meta.dir, '../../public/_headers')

describe('CONTENT_SECURITY_POLICY', () => {
	test('includes baseline hardening directives', () => {
		expect(CONTENT_SECURITY_POLICY).toContain("default-src 'self'")
		expect(CONTENT_SECURITY_POLICY).toContain("base-uri 'self'")
		expect(CONTENT_SECURITY_POLICY).toContain("object-src 'none'")
		expect(CONTENT_SECURITY_POLICY).toContain("frame-ancestors 'none'")
		expect(CONTENT_SECURITY_POLICY).toContain("form-action 'self'")
	})

	test('allows integrations used on the site', () => {
		expect(CONTENT_SECURITY_POLICY).toContain('https://giscus.app')
		expect(CONTENT_SECURITY_POLICY).toContain('https://mozilla.github.io')
		expect(CONTENT_SECURITY_POLICY).toContain('https://images.unsplash.com')
		expect(CONTENT_SECURITY_POLICY).toContain('https://*.seadn.io')
	})

	test('allows project markdown screenshots and Cloudflare Web Analytics', () => {
		expect(CONTENT_SECURITY_POLICY).toContain(
			'https://user-images.githubusercontent.com',
		)
		expect(CONTENT_SECURITY_POLICY).toContain(
			'https://static.cloudflareinsights.com',
		)
		expect(CONTENT_SECURITY_POLICY).toContain('https://cloudflareinsights.com')
	})

	test('matches public/_headers (prerendered routes)', () => {
		const headers = readFileSync(HEADERS_PATH, 'utf8')
		const fromHeaders = headers.match(/Content-Security-Policy: (.+)/)?.[1]
		expect(fromHeaders).toBe(CONTENT_SECURITY_POLICY)
	})

	test('is applied in middleware for on-demand routes', () => {
		const middleware = readFileSync(
			join(import.meta.dir, '../middleware.ts'),
			'utf8',
		)
		expect(middleware).toContain(
			"'Content-Security-Policy': CONTENT_SECURITY_POLICY",
		)
	})
})
