import type { APIRoute } from 'astro'
import { createElement as h } from 'react'

import {
	fetchImageAsDataUri,
	getDefaultFonts,
	OG_SIZE,
	renderOgImage,
	styles,
} from '@/lib/open-graph'
import { getNft } from '@/lib/open-sea'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
	try {
		const id = params.id as string

		const nft = await getNft(id)

		if (!nft) {
			const fonts = await getDefaultFonts()
			const empty = h('div', { style: styles.container })
			const png = await renderOgImage(empty, { ...OG_SIZE, fonts })
			return new Response(new Uint8Array(png), {
				headers: { 'content-type': 'image/png' },
			})
		}

		const [fonts, image] = await Promise.all([
			getDefaultFonts(),
			fetchImageAsDataUri(nft.image_url),
		])

		const element = h(
			'div',
			{ style: styles.container },
			h(
				'div',
				{ style: { ...styles.textContainer, marginBottom: 470 } },
				h('p', { style: styles.heading }, 'cesargdm - NFTs'),
				h('p', { style: styles.title }, nft.name),
			),
			image
				? h('img', { width: 450, height: 450, style: styles.nftImage, src: image })
				: null,
		)

		const png = await renderOgImage(element, { ...OG_SIZE, fonts })

		return new Response(new Uint8Array(png), {
			headers: {
				'content-type': 'image/png',
				'cache-control': 'public, max-age=3600, s-maxage=86400',
			},
		})
	} catch {
		return new Response('Failed to generate image', { status: 500 })
	}
}
