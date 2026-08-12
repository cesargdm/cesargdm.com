// @ts-check
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: cloudflare({
		// The site uses plain <img>/satori-based OG, not astro:assets, so we can
		// skip the Cloudflare Images binding.
		imageService: 'passthrough',
	}),
	site: 'https://cesargdm.com',
	integrations: [react()],
	vite: {
		plugins: [vanillaExtractPlugin()],
	},
})
