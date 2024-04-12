// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		allowMiddlewareResponseBody: true,
	},
	images: {
		minimumCacheTTL: 60,
		remotePatterns: [
			{ hostname: '**.unsplash.com' },
			{ hostname: '**.seadn.io' },
			{ hostname: '**.mypinata.cloud' },
			{ hostname: 'ipfs.io' },
			{ hostname: 'alchileverso.s3.amazonaws.com' },
			{ hostname: 'cdn.finiliar.com' },
			{ hostname: 'theyxolo.art' },
			{ hostname: 'arweave.net' },
			{ hostname: 'cretia.app' },
		],
	},
}

module.exports = withVanillaExtract(nextConfig)
