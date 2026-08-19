import { createElement as h } from 'react'
import type { APIRoute } from 'astro'
import { ImageResponse } from 'workers-og'

import { isLocale } from '@/lib/i18n'
import {
	getAvatarDataUri,
	getFonts,
	OG_SIZE,
	ogResponse,
	styles,
} from '@/lib/open-graph'
import { getProjects } from '@/lib/projects'

export const prerender = false

export const GET: APIRoute = ({ params }) => {
	try {
		const locale = isLocale(params.locale) ? params.locale : 'en'
		const slug = params.slug as string

		const asset = getProjects(locale).find((project) => project.slug === slug)

		const fonts = getFonts()
		const logo = getAvatarDataUri()

		const element = h(
			'div',
			{ style: styles.container },
			h(
				'div',
				{ style: styles.textContainer },
				h('p', { style: styles.heading }, 'cesargdm - Projects'),
				h('p', { style: styles.title }, asset?.data?.title as string),
				h('p', { style: styles.extract }, asset?.data?.description as string),
			),
			logo
				? h('img', {
						width: 290,
						height: 290,
						style: styles.rightImage,
						src: logo,
					})
				: null,
		)

		return ogResponse(new ImageResponse(element, { ...OG_SIZE, fonts }))
	} catch {
		return new Response('Failed to generate image', { status: 500 })
	}
}
