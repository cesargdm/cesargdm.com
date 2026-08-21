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
	const [rerenderKey, setRerenderKey] = useState(0)
	const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		function handleResizeEvent() {
			setIsResizing(true)

			if (resizeTimer.current) {
				clearTimeout(resizeTimer.current)
			}

			resizeTimer.current = setTimeout(() => {
				setIsResizing(false)
				setRerenderKey((prev) => prev + 1)
				// eslint-disable-next-line no-magic-numbers
			}, 100)
		}

		window.addEventListener('resize', handleResizeEvent)

		return () => {
			window.removeEventListener('resize', handleResizeEvent)
			if (resizeTimer.current) clearTimeout(resizeTimer.current)
		}
	}, [])

	if (isResizing) {
		return null
	}

	const availableImages = data.filter((image) => image?.image_url)

	return (
		<div key={rerenderKey} className={nftsList}>
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
											src={nft.image_url}
											width={100}
											height={100}
											loading="lazy"
											className={nftImage}
											alt={nft.name || ''}
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
