// @ts-check
import process from 'node:process'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: cloudflare({
		// The site uses plain <img> plus workers-og for OG PNGs, not astro:assets,
		// so we can skip the Cloudflare Images binding.
		imageService: 'passthrough',
		// Remote bindings (Workers AI) require Cloudflare auth. Toggle off locally
		// via ASTRO_CF_NO_REMOTE=1 to run dev without a Cloudflare login.
		remoteBindings: process.env.ASTRO_CF_NO_REMOTE !== '1',
	}),
	site: 'https://cesargdm.com',
	integrations: [react()],
	vite: {
		plugins: [vanillaExtractPlugin()],
	},
})
