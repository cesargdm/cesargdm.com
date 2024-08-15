/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		minimumCacheTTL: 2600000,
		remotePatterns: [
			{ hostname: '**.unsplash.com' },
			{ hostname: '**.seadn.io' },
			{ hostname: '**.mypinata.cloud' },
			{ hostname: 'ipfs.io' },
			{ hostname: 'alchileverso.s3.amazonaws.com' },
			{ hostname: 'cdn.finiliar.com' },
			{ hostname: 'theyxolo.art' },
			{ hostname: 'arweave.net' },
			{ hostname: 'web.cretia.app' },
		],
	},
}

module.exports = withVanillaExtract(nextConfig)
