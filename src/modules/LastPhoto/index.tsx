import { IconBrandUnsplash } from '@tabler/icons-react'
import Image from 'next/image'
import { square } from './styles.css'
import { vars } from '@/app/theme.css'

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
					alt={response?.alt_description}
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
