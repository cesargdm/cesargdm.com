/**
 * Browser verification for CSP: violations from load, failed requests, and
 * home-card sanity checks (including no visible empty integration slots).
 *
 * Usage: bun run build && bun run preview &  bun scripts/verify-content-security-policy.mjs
 * Optional: BASE_URL=https://cesargdm.com (no local preview) — still enforces policy via route.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { chromium } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { CONTENT_SECURITY_POLICY } = await import(
	pathToFileURL(join(root, 'src/lib/content-security-policy.ts')).href
)

const headersFile = readFileSync(join(root, 'public/_headers'), 'utf8')
const cspFromHeaders = headersFile.match(/Content-Security-Policy: (.+)/)?.[1]
if (cspFromHeaders !== CONTENT_SECURITY_POLICY) {
	console.error(
		'public/_headers CSP does not match src/lib/content-security-policy.ts — run: bun scripts/sync-public-headers.mjs',
	)
	process.exit(1)
}

const baseUrl = process.env.BASE_URL ?? 'http://localhost:4321'
const injectCsp = process.env.INJECT_CSP !== '0'

function isIgnoredNetworkUrl(urlString) {
	if (!urlString) return false
	try {
		const url = new URL(urlString, baseUrl)
		return url.pathname.includes('favicon')
	} catch {
		return false
	}
}

const ROUTES = [
	'/en',
	'/es',
	'/en/blog',
	'/en/blog/modern-moderation',
	'/en/projects',
	'/en/projects/cretia',
	'/en/projects/c-chess',
	'/en/projects/coffee-atlas',
	'/en/projects/photo-mosaic',
	'/en/projects/cv-review',
	'/en/projects/qr-code-generator',
	'/en/chat',
	'/en/nfts',
	'/es/projects/atlas-del-cafe',
	'/es/projects/codigo-qr',
	'/es/projects/revisor-cv',
	'/es/projects/mosaico-de-fotos',
]

const HOME_CARD_MARKERS = {
	en: {
		chat: /AI Chat|Hey!/i,
		bluesky: /Bluesky/i,
		run: /\d+\s*km[\s\S]*ran this year/i,
	},
	es: {
		chat: /Chat|Hola/i,
		bluesky: /Bluesky/i,
		run: /\d+\s*km[\s\S]*corridos este año/i,
	},
}

function pathForLocale(pathname) {
	return pathname.startsWith('/es') ? 'es' : 'en'
}

async function verifyRoute(page, pathname) {
	const violations = []
	const failed = []

	page.removeAllListeners('securitypolicyviolation')
	page.removeAllListeners('requestfailed')

	page.on('securitypolicyviolation', (event) => {
		violations.push({
			directive: event.violatedDirective,
			blocked: event.blockedURI,
			source: event.sourceFile,
		})
	})
	page.on('requestfailed', (request) => {
		if (isIgnoredNetworkUrl(request.url())) return
		const error = request.failure()?.errorText ?? ''
		// Only treat CSP blocks as failures — embeds can fail for XFO/CORP or navigation.
		if (error !== 'csp' && !error.includes('ERR_BLOCKED_BY_CLIENT')) return
		failed.push({
			url: request.url(),
			error,
		})
	})

	const url = `${baseUrl}${pathname}`
	await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })

	const domViolations = await page.evaluate(() => window.__cspViolations ?? [])

	const emptyVisibleCards = await page.evaluate(() => {
		const lists = document.querySelectorAll('main ul')
		let count = 0
		for (const ul of lists) {
			for (const li of ul.querySelectorAll(':scope > li')) {
				const rect = li.getBoundingClientRect()
				const visible =
					rect.width > 48 &&
					rect.height > 48 &&
					getComputedStyle(li).display !== 'none' &&
					getComputedStyle(li).visibility !== 'hidden'
				const text = li.textContent?.replace(/\s+/g, '').trim() ?? ''
				if (visible && text.length === 0) count++
			}
		}
		return count
	})

	const locale = pathForLocale(pathname)
	const main = page.locator('main')
	await main.waitFor({ state: 'attached', timeout: 60_000 })
	const bodyText = await main.evaluate((node) => node.textContent ?? '')

	const homeIssues = []
	if (pathname === '/en' || pathname === '/es') {
		const markers = HOME_CARD_MARKERS[locale]
		if (!markers.chat.test(bodyText)) {
			homeIssues.push('missing AI Chat card copy')
		}
		if (!markers.bluesky.test(bodyText)) {
			homeIssues.push('missing Bluesky card copy')
		}
		if (emptyVisibleCards > 0) {
			homeIssues.push(`${emptyVisibleCards} visible empty home card(s)`)
		}
		// When Strava data is baked in at build time, the run stat must show.
		if (markers.run.test(bodyText)) {
			const runVisible = await page.evaluate(() => {
				for (const li of document.querySelectorAll('main ul > li')) {
					if (!/ran this year|corridos este año/.test(li.textContent ?? '')) {
						continue
					}
					const rect = li.getBoundingClientRect()
					return rect.width > 0 && rect.height > 0
				}
				return false
			})
			if (!runVisible) {
				homeIssues.push('Run card copy present but not visible')
			}
		}
	}

	const pageIssues = []
	if (pathname === '/en/projects/cretia') {
		const githubScreenshotsLoaded = await page.evaluate(() => {
			const host = 'user-images.githubusercontent.com'
			const imgs = [...document.querySelectorAll('main img')].filter((img) => {
				try {
					return new URL(img.src).hostname === host
				} catch {
					return false
				}
			})
			return (
				imgs.length >= 2 &&
				imgs.every((img) => img.complete && img.naturalWidth > 0)
			)
		})
		if (!githubScreenshotsLoaded) {
			pageIssues.push('GitHub user-images project screenshots did not load')
		}
	}

	const allViolations = [...violations, ...domViolations].filter(
		(entry) => !isIgnoredNetworkUrl(entry.blocked ?? ''),
	)

	return {
		pathname,
		violations: allViolations,
		failed,
		emptyVisibleCards,
		homeIssues,
		pageIssues,
	}
}

const browser = await chromium.launch()
const context = await browser.newContext()

await context.addInitScript(() => {
	window.__cspViolations = []
	document.addEventListener('securitypolicyviolation', (event) => {
		window.__cspViolations.push({
			directive: event.violatedDirective,
			blocked: event.blockedURI,
		})
	})
})

if (injectCsp) {
	await context.route('**/*', async (route) => {
		const response = await route.fetch()
		const headers = { ...response.headers() }
		if (route.request().resourceType() === 'document') {
			headers['content-security-policy'] = CONTENT_SECURITY_POLICY
		}
		await route.fulfill({ response, headers })
	})
}

const page = await context.newPage()
const results = []
let failedRun = false

for (const pathname of ROUTES) {
	try {
		const result = await verifyRoute(page, pathname)
		results.push(result)
		const homeEmptyCards =
			(result.pathname === '/en' || result.pathname === '/es') &&
			result.emptyVisibleCards > 0
		if (
			result.violations.length > 0 ||
			result.failed.length > 0 ||
			result.homeIssues.length > 0 ||
			result.pageIssues.length > 0 ||
			homeEmptyCards
		) {
			failedRun = true
			console.error(`FAIL ${pathname}`, result)
		} else {
			process.stdout.write(`ok ${pathname}\n`)
		}
	} catch (error) {
		failedRun = true
		console.error(`FAIL ${pathname}`, error)
	}
}

await browser.close()

if (failedRun) {
	process.exit(1)
}

process.stdout.write(
	`CSP verification passed for ${results.length} routes at ${baseUrl}\n`,
)
