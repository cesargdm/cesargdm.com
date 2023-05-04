import { IconBrandUnsplash } from '@tabler/icons-react'
import Image from 'next/image'
import { vars } from '@/app/theme.css'

import { square } from './styles.css'

function getData() {
	return fetch('https://cesargdm.com/api/unsplash/last-photos', {
		method: 'GET',
		next: { revalidate: 60 * 60 * 24 },
	})
		.then((response) => response.json())
		.catch(() => undefined)
}

async function LastPhoto() {
	const response = await getData()

	const photoUrl = response[0].urls.regular

	return (
		<>
			<span className={square} aria-hidden />
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
					alt={response[0]?.alt_description}
				/>
			)}
			<a
				style={{
					position: 'absolute',
					top: vars.space.medium,
					left: vars.space.medium,
				}}
				target="_blank"
				rel="noopener noreferrer"
				href="https://unsplash.com/@cesargdm"
				aria-label="Visit César Guadarrama portfolio on Unsplash"
			>
				<IconBrandUnsplash fill="white" strokeWidth={0} aria-hidden />
			</a>
		</>
	)
}

export default LastPhoto
