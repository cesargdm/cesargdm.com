import { NextResponse } from 'next/server'

const Xray = require('x-ray')
const x = Xray()

// 1 week
export const revalidate = 60 * 60 * 24 * 7

export async function GET() {
	const rawResults = await x(
		'https://www.goodreads.com/review/list/119995387-c-sar-guadarrama?shelf=currently-reading',
		'#booksBody .bookalike',
		[
			{
				image: 'img@src',
				title: '.title .value a',
				url: '.title .value a@href',
			},
		],
	)

	const results = rawResults.map((result: any) => ({
		...result,
		title: result.title.replace(/\s\s+/g, '').replace(/\n/g, ''),
		image: result.image.replace(/\s\s+/g, '').replace(/\._.*_\./g, '.'),
	}))

	return NextResponse.json(results)
}
