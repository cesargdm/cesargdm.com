// @ts-check
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import { defineConfig } from 'astro/config'

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'

// https://astro.build/config
export default defineConfig({
	output: 'server',
	adapter: vercel(),
	site: 'https://cesargdm.com',
	integrations: [react()],
	image: {
		remotePatterns: [{ protocol: 'https' }],
	},
	vite: {
		plugins: [vanillaExtractPlugin()],
	},
})
