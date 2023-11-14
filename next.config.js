// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'i.seadn.io',
			},
		],
	},
}

module.exports = withVanillaExtract(nextConfig)
