'use client'

import { useEffect, useRef, useState } from 'react'

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
		// marginRight: '2%',
	},
}

// eslint-disable-next-line no-magic-numbers
const columnsArray = new Array(3).fill(0)
// eslint-disable-next-line no-magic-numbers
const rowArray = new Array(2).fill(0)

export default function NftList({ data }: { data: any[] }) {
	const [isResizing, setIsResizing] = useState(false)
	let resizeTimer = useRef<any>(null).current

	useEffect(() => {
		function handleResizeEvent() {
			setIsResizing(true)

			if (typeof resizeTimer === 'number') {
				clearTimeout(resizeTimer)
			}

			// eslint-disable-next-line react-hooks/exhaustive-deps
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
										<img
											src={nft.image_url.replace('w=500', 'w=200')}
											className={nftImage}
											alt=""
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
