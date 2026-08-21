import type { APIRoute } from 'astro'
import { createElement as h } from 'react'
import { ImageResponse } from 'workers-og'

import {
	fetchImageAsDataUri,
	getFonts,
	OG_SIZE,
	ogResponse,
	styles,
} from '@/lib/open-graph'
import { getNft } from '@/lib/open-sea'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
	try {
		const id = params.id as string

		const nft = await getNft(id)

		const fonts = getFonts()

		if (!nft) {
			const empty = h('div', { style: styles.container })
			return ogResponse(new ImageResponse(empty, { ...OG_SIZE, fonts }))
		}

		const image = await fetchImageAsDataUri(nft.image_url)

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
				? h('img', {
						width: 450,
						height: 450,
						style: styles.nftImage,
						src: image,
					})
				: null,
		)

		return ogResponse(new ImageResponse(element, { ...OG_SIZE, fonts }))
	} catch {
		return new Response('Failed to generate image', { status: 500 })
	}
}
