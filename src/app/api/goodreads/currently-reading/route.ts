import { load } from 'cheerio'
import { NextResponse } from 'next/server'

/**
 * 24 hours
 */
// eslint-disable-next-line no-magic-numbers
export const revalidate = 60 * 60 * 24

export async function GET() {
	/**
	 * I hope this does not break the tos of goodreads, if it does, please let me know
	 * and I'll be sorry.
	 */
	const textResponse = await fetch(
		'https://www.goodreads.com/review/list/119995387-c-sar-guadarrama?shelf=currently-reading',
		// eslint-disable-next-line no-magic-numbers
		{ next: { revalidate: 60 * 60 * 24 } },
	).then((response) => response.text())

	const $ = load(textResponse)

	const results = [] as {
		title: string
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

	return NextResponse.json(results, {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
	})
}
