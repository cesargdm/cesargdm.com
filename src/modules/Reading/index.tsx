import { IconBook } from '@tabler/icons-react'

import { getCurrentlyReading } from '@/lib/goodreads'

import { vars } from '@/app/theme.css'

import {
	bookAnchor,
	bookImage,
	bookItem,
	bookList,
	titleText,
} from './styles.css'

export default async function Reading() {
	const books = await getCurrentlyReading()

	if (!books.length) return null

	return (
		<>
			<h2 style={{ padding: vars.space.large }}>
				<IconBook aria-hidden />
				Reading
			</h2>
			<ul className={bookList}>
				{books.map((book) => (
					<li key={book.url} className={bookItem}>
						<a
							href={book.url}
							target="_blank"
							className={bookAnchor}
							rel="noopener noreferrer"
						>
							<img
								width={98}
								height={147}
								loading="lazy"
								decoding="async"
								className={bookImage}
								src={book.image}
								alt=""
							/>
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
