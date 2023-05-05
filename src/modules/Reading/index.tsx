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

			<p>{JSON.stringify(data, null, 2)}</p>
		</>
	)
}
