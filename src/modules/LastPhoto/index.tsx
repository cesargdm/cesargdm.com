import { IconBrandUnsplash } from '@tabler/icons-react'
import Image from 'next/image'

async function LastPhoto() {
	const response = await fetch(
		'https://cesargdm.com/api/unsplash/last-photos',
		{
			method: 'GET',
			cache: 'force-cache',
		},
	)
		.then((response) => response.json())
		.catch(() => undefined)

	const photoUrl = response[0].urls.regular

	return (
		<>
			{photoUrl && (
				<Image
					src={photoUrl}
					width={500}
					height={500}
					style={{
						objectFit: 'cover',
						position: 'absolute',
						top: 0,
						right: 0,
						width: '100%',
						height: '100%',
					}}
					alt={response?.alt_description}
				/>
			)}
			<IconBrandUnsplash color="white" />
		</>
	)
}

export default LastPhoto
