/**
 * Full-page screenshots for CSP before/after comparison.
 * - before: production without injected CSP
 * - after: production with enforced policy (same HTML as prod deploy)
 */
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { chromium } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir =
	process.env.SCREENSHOT_DIR ??
	join(root, 'cloud-agent-artifacts/csp-screenshots')

const { CONTENT_SECURITY_POLICY } = await import(
	pathToFileURL(join(root, 'src/lib/content-security-policy.ts')).href
)

const routes = ['/en', '/es']

async function shot(page, url, path, inject) {
	if (inject) {
		await page.route('**/*', async (route) => {
			const response = await route.fetch()
			const headers = { ...response.headers() }
			if (route.request().resourceType() === 'document') {
				headers['content-security-policy'] = CONTENT_SECURITY_POLICY
			}
			await route.fulfill({ response, headers })
		})
	}

	await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
	await page.evaluate(() =>
		document.querySelector('main')?.scrollIntoView({ block: 'start' }),
	)
	await page.screenshot({ path, fullPage: true })
	if (inject) await page.unroute('**/*')
}

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 1280, height: 900 })

for (const route of routes) {
	const url = `https://cesargdm.com${route}`
	await shot(
		page,
		url,
		join(outDir, `csp-before-home-${route.slice(1)}.png`),
		false,
	)
	await shot(
		page,
		url,
		join(outDir, `csp-after-home-${route.slice(1)}.png`),
		true,
	)
}

await browser.close()
process.stdout.write(`Wrote screenshots to ${outDir}\n`)
