import { describe, expect, test } from 'bun:test'

import { CONTENT_SECURITY_POLICY } from '@/lib/content-security-policy'

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
})
