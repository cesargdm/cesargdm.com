import { IconBook } from '@tabler/icons-react'

async function getData() {
	const result = await fetch(
		'https://cesargdm.com/api/goodreads/currently-reading',
	)
		.then((response) => response.json())
		.catch(() => null)

	return result
}

export default async function Reading() {
	const data = await getData()

	return (
		<>
			<h2>
				<IconBook aria-hidden />
				Reading
			</h2>

			<ul>
				{data?.map((book: any) => (
					<li key={book.title}>
						<a href={book.url} target="_blank" rel="noopener noreferrer">
							<img src={book.image} alt="" />
							<p>{book.title}</p>
						</a>
					</li>
				))}
			</ul>
		</>
	)
}
