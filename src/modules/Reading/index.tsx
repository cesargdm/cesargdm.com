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
	const result = await fetch(
		'https://cesargdm.com/api/goodreads/currently-reading',
		{ next: { revalidate: 60 * 60 * 24 } },
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
					<li className={bookItem} key={book.title}>
						<a
							href={book.url}
							target="_blank"
							className={bookAnchor}
							rel="noopener noreferrer"
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
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
