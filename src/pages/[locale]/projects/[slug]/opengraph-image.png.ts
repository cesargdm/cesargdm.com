import { createElement as h } from 'react'
import type { APIRoute } from 'astro'

import { BASE_URL } from '@/lib/constants'
import { isLocale } from '@/lib/i18n'
import {
	fetchFonts,
	fetchImageAsDataUri,
	OG_SIZE,
	renderOgImage,
	styles,
} from '@/lib/open-graph'
import { getProjects } from '@/lib/projects'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
	try {
		const locale = isLocale(params.locale) ? params.locale : 'en'
		const slug = params.slug as string

		const asset = getProjects(locale).find((project) => project.slug === slug)

		const [fonts, logo] = await Promise.all([
			fetchFonts('Inter', [
				{
					weight: 400,
					url: 'https://rsms.me/inter/font-files/Inter-Regular.woff',
				},
				{
					weight: 600,
					url: 'https://rsms.me/inter/font-files/Inter-Black.woff',
				},
			]),
			fetchImageAsDataUri(`${BASE_URL}/android-chrome-512x512.png`),
		])

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
