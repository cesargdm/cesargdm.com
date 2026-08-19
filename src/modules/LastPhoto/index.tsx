import { IconBrandUnsplash } from '@tabler/icons-react'
import Image from 'next/image'

import { getLastPhotos } from '@/lib/unsplash'

import { vars } from '@/app/theme.css'

import {
	image,
	morePhotosButton,
	photoContainer,
	photosWrapper,
} from './styles.css'

async function LastPhoto() {
	const photos = await getLastPhotos()

	return (
		<>
			<div className={photosWrapper}>
				{photos.map((photo) => (
					<div key={photo.id} className={photoContainer}>
						<Image
							width={photo.width}
							height={photo.height}
							className={image}
							src={photo.url}
							alt={photo.alt}
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
