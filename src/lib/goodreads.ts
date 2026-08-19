import { logIntegrationFailure } from '@/lib/log'

const GOODREADS_USER_ID = '119995387'
const ONE_DAY_SECONDS = 86400

export type Book = {
	title: string
	url: string
	author: string
	image: string
}

function readTag(item: string, tag: string) {
	const match = new RegExp(
		`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`,
	).exec(item)

	return match?.[1]?.trim() ?? ''
}

/**
 * Goodreads redirects the HTML shelf to a sign-in page, so the public RSS feed
 * is the only unauthenticated source. Parsed by hand to avoid shipping an HTML
 * parser to the edge runtime.
 */
export async function getCurrentlyReading(): Promise<Book[]> {
	try {
		const response = await fetch(
			`https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=currently-reading`,
			{ next: { revalidate: ONE_DAY_SECONDS } },
		)

		if (!response.ok) {
			throw new Error(`Goodreads responded ${response.status}`)
		}

		const xml = await response.text()
		const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? []

		return items
			.map((item) => ({
				title: readTag(item, 'title'),
				url: readTag(item, 'link'),
				author: readTag(item, 'author_name'),
				image: readTag(item, 'book_large_image_url'),
			}))
			.filter((book) => book.title && book.url)
	} catch (error) {
		logIntegrationFailure('goodreads', error)
		return []
	}
}
