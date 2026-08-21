// @ts-check
import process from 'node:process'

import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import { lingui } from '@lingui/vite-plugin'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: cloudflare({
		// The site uses plain <img> plus workers-og for OG PNGs, not astro:assets,
		// so we can skip the Cloudflare Images binding.
		imageService: 'passthrough',
		// Off by default: enabling remote bindings starts a proxy session that
		// needs Cloudflare auth, which would make `astro build` — and therefore
		// CI — fail without a token. The deployed Worker gets the real AI binding
		// from wrangler.jsonc regardless; this only affects local dev.
		// Set ASTRO_CF_REMOTE=1 to exercise Workers AI from `astro dev`.
		remoteBindings: process.env.ASTRO_CF_REMOTE === '1',
	}),
	site: 'https://cesargdm.com',
	// Nav links were doing full-document reloads. ClientRouter swaps the document
	// instead; prefetching on hover means the swap usually has the page already.
	prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
	// Emit /en.html rather than /en/index.html so requests for the canonical,
	// unslashed URLs the site links to are served directly instead of costing a
	// redirect hop (Lighthouse measured ~900ms for that round trip).
	build: { format: 'file' },
	trailingSlash: 'never',
	integrations: [react()],
	vite: {
		// lingui() compiles src/locales/*.po on import. Only the catalogs are
		// wired up: Lingui's macros cannot run in .astro frontmatter, so call
		// sites use the runtime form instead (see src/lib/translate.ts) and no
		// Babel transform is needed.
		plugins: [lingui(), vanillaExtractPlugin()],
		// The PhotoMosaic island declares its worker `{ type: 'module' }`, and
		// Vite rewrites only the URL — not the type. Its default 'iife' output
		// therefore works only while the worker stays a single chunk, and fails
		// the build the moment one is shared. Note this does NOT extend
		// worker.plugins, which stays empty: vanilla-extract and Lingui do not
		// run for the worker bundle, so nothing it imports may reach a .css.ts
		// or a .po.
		worker: { format: 'es' },
	},
})
