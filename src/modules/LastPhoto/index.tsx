import Image from 'next/image'

async function LastPhoto() {
	const staticData = await fetch('/api/unsplash/last-photos', {
		cache: 'force-cache',
	})
		.then((response) => response.json())
		.catch(() => undefined)

	const photoUrl = staticData?.urls?.thumb

	return (
		<>
			<Image src={photoUrl} alt={staticData?.alt_description} />
		</>
	)
}

export default LastPhoto
