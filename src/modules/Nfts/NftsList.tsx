'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import {
	nftImage,
	nftListWrapper,
	nftListWrapper2,
	nftsList,
} from './styles.css'

const styles = {
	item: {
		overflow: 'hidden',
		height: '100%',
		aspectRatio: 1,
		borderRadius: '20%',
	},
}

// eslint-disable-next-line no-magic-numbers
const columnsArray = new Array(3).fill(0)
const rowArray = new Array(2).fill(0)

type Props = {
	data: { name: string; image_url: string }[]
}

export default function NftList({ data }: Props) {
	const [isResizing, setIsResizing] = useState(false)
	let resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null).current

	useEffect(() => {
		function handleResizeEvent() {
			setIsResizing(true)

			if (typeof resizeTimer === 'number') {
				clearTimeout(resizeTimer)
			}

			resizeTimer = setTimeout(() => {
				setIsResizing(false)
				// eslint-disable-next-line no-magic-numbers
			}, 100)
		}

		window.addEventListener('resize', handleResizeEvent)

		return () => {
			window.removeEventListener('resize', handleResizeEvent)
		}
	}, [])

	if (isResizing) {
		return null
	}

	const availableImages = data.filter((image) => image?.image_url)

	return (
		<div key={String(resizeTimer)} className={nftsList}>
			{rowArray.map((_, fsIndex) => (
				<div key={fsIndex} className={nftListWrapper}>
					{columnsArray.map((_, groupIndex) => (
						<div
							key={groupIndex}
							className={
								fsIndex ? nftListWrapper2.first : nftListWrapper2.second
							}
						>
							{availableImages
								// eslint-disable-next-line no-magic-numbers
								.filter((_, index) => (index + groupIndex) % 3 === 0)
								.map((nft, index) => (
									<div
										key={index}
										style={{
											...styles.item,
											transform:
												groupIndex === 1 ? `translateX(-50%)` : undefined,
										}}
									>
										<Image
											src={nft.image_url}
											width={150}
											height={150}
											quality={80}
											className={nftImage}
											blurDataURL="data:image/png;base64,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"
											alt={nft.name}
										/>
									</div>
								))}
						</div>
					))}
				</div>
			))}
		</div>
	)
}
