import { graphql } from 'gatsby'
import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import * as AspectRatio from '@radix-ui/react-aspect-ratio'
import ColorThief from 'colorthief'

import Template from '../templates'

const NftImage = styled.img`
	display: block;
	width: 100%;
	height: 100%;
	background-color: var(--colors--border);
	object-fit: cover;
	position: absolute;
	top: 0;
	left: 0;
`

const NftContainer = styled.li<{ color: string }>`
	display: flex;
	flex-direction: column;
	gap: 4px;
	background-color: ${({ color }) => color};
	border-radius: var(--border_radius--medium);
	overflow: hidden;
`

const NftTitle = styled.p`
	font-weight: 700;
	font-size: 0.9rem;
	margin: auto;
	height: 60px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	flex-grow: 1;
	align-items: center;
	text-align: center;
	background: inherit;
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	padding: 10px;
	filter: invert(1) grayscale(1) contrast(9);
`

const NftsList = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	align-items: flex-end;
	gap: 16px;
`

const AddressButton = styled.button`
	font-weight: 600;
	padding: 0 10px;
	align-self: center;
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1%;
	height: 100%;
`

let cachedColors = new Map()

try {
	if (typeof window !== 'undefined') {
		const cachedColorsString = window.localStorage.getItem('cachedColors')

		if (cachedColorsString) {
			cachedColors = new Map(JSON.parse(cachedColorsString))
		}
	}
} catch {
	//
}

function Nft(token: any) {
	const ref = useRef(null)
	const [isLoaded, setIsLoaded] = useState(false)
	const [color, setColor] = useState(cachedColors.get(token.imageThumbnailUrl))

	const colorThief = new ColorThief()

	function handleOnload() {
		setIsLoaded(true)
	}

	useEffect(() => {
		if (!ref.current || !isLoaded) return

		const cachedColor = cachedColors.get(token.imageThumbnailUrl)
		if (cachedColor && cachedColor.length === 3) {
			return
		}

		const color = colorThief.getColor(ref.current)

		cachedColors.set(token.imageThumbnailUrl, color)

		// Save to localstorage
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(
				'cachedColors',
				JSON.stringify([...cachedColors]),
			)
		}

		setColor(color)
	}, [ref, isLoaded])

	return (
		<NftContainer color={`rgb(${color?.join(',')})`}>
			<AspectRatio.Root ratio={1}>
				<NftImage
					ref={ref}
					// This is a joke ;)
					draggable={false}
					onLoad={handleOnload}
					src={token.imageThumbnailUrl}
					crossOrigin="anonymous"
					alt={`${token.name}. ${token.description}`}
				/>
			</AspectRatio.Root>
			<NftTitle>{token.name ?? 'Untitled'}</NftTitle>
		</NftContainer>
	)
}

function Nfts({ data: { allNft } }: any) {
	const nfts = allNft.nodes

	function handleCopyAddress() {
		if (typeof window !== 'undefined') {
			window?.navigator.clipboard.writeText(
				`0xe3a856e4034d25ff68b3702b8f1618173bbfa130`,
			)
		}
	}

	return (
		<Template title="nfts">
			<Container>
				<AddressButton onClick={handleCopyAddress}>cesargdm.eth</AddressButton>
				<h2>Gallery</h2>
				<NftsList>
					{nfts.map((token: any) => (
						<Nft key={token.id} {...token} />
					))}
				</NftsList>
			</Container>
		</Template>
	)
}

export const query = graphql`
	query GetAllNfts {
		allNft(filter: { imageUrl: { ne: null } }, sort: { lastSale: DESC }) {
			nodes {
				id
				name
				imageUrl
				lastSale
				permalink
				description
				imageThumbnailUrl
				collection {
					name
				}
				creator {
					user {
						username
					}
				}
			}
		}
	}
`

export default Nfts
