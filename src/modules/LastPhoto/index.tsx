import { IconBrandUnsplash } from '@tabler/icons-react'
import Image from 'next/image'

import { BASE_URL } from '@/lib/constants'

import { vars } from '@/app/theme.css'

import {
	image,
	morePhotosButton,
	photoContainer,
	photosWrapper,
} from './styles.css'

type Photo = { id: string; urls: { regular: string }; alt_description: string }

function getData() {
	// eslint-disable-next-line no-magic-numbers
	const ONE_DAY = 60 * 60 * 24

	return fetch(`${BASE_URL}/api/unsplash/last-photos`, {
		method: 'GET',
		next: { revalidate: ONE_DAY },
	})
		.then((response) => response.json() as Promise<Photo[]>)
		.catch(() => undefined)
}

async function LastPhoto() {
	const data = await getData()

	return (
		<>
			<div className={photosWrapper}>
				{data?.map((photo) => (
					<div key={photo.id} className={photoContainer}>
						<Image
							width={500}
							height={500}
							className={image}
							src={photo.urls.regular}
							alt={data[0]?.alt_description ?? ''}
						/>
					</div>
				))}
			</div>
			<a
				target="_blank"
				rel="noopener noreferrer"
				className={morePhotosButton}
				href="https://unsplash.com/@cesargdm"
			>
				View more photos
			</a>
			<div
				style={{
					color: 'white',
					display: 'flex',
					position: 'absolute',
					top: vars.space.large,
					gap: vars.space.small,
					textDecoration: 'none',
					left: vars.space.large,
				}}
			>
				<IconBrandUnsplash fill="white" strokeWidth={0} aria-hidden />
				<h2>Unsplash</h2>
			</div>
		</>
	)
}

export default LastPhoto
