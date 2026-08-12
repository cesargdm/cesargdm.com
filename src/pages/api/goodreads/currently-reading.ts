import type { APIRoute } from 'astro'
import { load } from 'cheerio'

export const prerender = false

// 24 hours
const REVALIDATE = 86400

export const GET: APIRoute = async () => {
	/**
	 * I hope this does not break the tos of goodreads, if it does, please let me
	 * know and I'll be sorry.
	 */
	const textResponse = await fetch(
		'https://www.goodreads.com/review/list/119995387-c-sar-guadarrama?shelf=currently-reading',
	).then((response) => response.text())

	const $ = load(textResponse)

	const results = [] as {
		title: string
		author: string
		image?: string
		url?: string
	}[]

	$('#booksBody .bookalike').each((_index, element) => {
		const $element = $(element)

		const result = {
			title: $element.find('.title .value a').text().trim(),
			author: $element.find('.author .value a').text().trim(),
			image: $element
				.find('img')
				.attr('src')
				?.replace(/\._.*_\./g, '.'),
			url: `https://goodreads.com${$element
				.find('.title .value a')
				.attr('href')}`,
		}

		results.push(result)
	})

	return new Response(JSON.stringify(results), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': `public, s-maxage=${REVALIDATE}, stale-while-revalidate`,
		},
	})
}
