import Image from 'next/image'

async function LastPhoto() {
	const staticData = await fetch('/api/unsplash/last-photo', {
		cache: 'force-cache',
	})
		.then((response) => response.json())
		.catch(() => undefined)

	const photoUrl = staticData?.urls?.thumb

	return (
		<>
			<h2>Unsplash</h2>
			<Image src={photoUrl} alt={staticData?.alt_description} />
		</>
	)
}

export default LastPhoto
