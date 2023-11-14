import { IconBook } from '@tabler/icons-react'

import { vars } from '@/app/theme.css'

import {
	bookAnchor,
	bookImage,
	bookItem,
	bookList,
	titleText,
} from './styles.css'

async function getData() {
	// eslint-disable-next-line no-magic-numbers
	const ONE_DAY = 60 * 60 * 24

	const result = await fetch(
		'https://cesargdm.com/api/goodreads/currently-reading',
		{ next: { revalidate: ONE_DAY } },
	)
		.then((response) => response.json())
		.catch(() => null)

	return result
}

export default async function Reading() {
	const data = await getData()

	return (
		<>
			<h2 style={{ padding: vars.space.large }}>
				<IconBook aria-hidden />
				Reading
			</h2>
			<ul className={bookList}>
				{data?.map((book: any) => (
					<li key={book.title} className={bookItem}>
						<a
							href={book.url}
							target="_blank"
							className={bookAnchor}
							rel="noopener noreferrer"
						>
							<img className={bookImage} src={book.image} alt="" />
							<div
								style={{ textAlign: 'center', marginTop: 16, height: '3rem' }}
							>
								<p className={titleText}>{book.title}</p>
								<p>{book.author}</p>
							</div>
						</a>
					</li>
				))}
			</ul>
		</>
	)
}
