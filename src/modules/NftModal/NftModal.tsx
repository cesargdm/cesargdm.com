import { useCallback, useEffect, useState } from 'react'

import Modal from '@/components/Modal'
import NftInfo from '@/components/Nft'

import type { Nft } from '@/lib/open-sea'

const NFT_PATH = /^\/(?:en|es)\/nfts\/([^/]+)\/?$/

/**
 * Reimplements the Next.js parallel + intercepting route modal.
 *
 * Soft (in-app) navigations to /{locale}/nfts/{id} are intercepted and shown in
 * an overlay dialog, while direct visits / refreshes fall through to the full
 * page at src/pages/[locale]/nfts/[id].astro.
 */
export default function NftModal() {
	const [nft, setNft] = useState<Nft | null>(null)

	const loadNft = useCallback(async (id: string) => {
		const data = await fetch(`/api/nfts/${id}`)
			.then((response) =>
				response.ok ? (response.json() as Promise<Nft>) : null,
			)
			.catch(() => null)

		if (data) setNft(data)
	}, [])

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (event.defaultPrevented || event.button !== 0) return
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
				return

			const anchor = (event.target as HTMLElement | null)?.closest('a')
			const href = anchor?.getAttribute('href')

			if (!href) return

			const match = NFT_PATH.exec(href)

			if (!match) return

			event.preventDefault()

			const id = match[1]

			window.history.pushState({ nftModal: id }, '', href)
			void loadNft(id)
		}

		function handlePopState() {
			const state = window.history.state as { nftModal?: string } | null

			if (state?.nftModal) {
				void loadNft(state.nftModal)
			} else {
				setNft(null)
			}
		}

		document.addEventListener('click', handleClick)
		window.addEventListener('popstate', handlePopState)

		return () => {
			document.removeEventListener('click', handleClick)
			window.removeEventListener('popstate', handlePopState)
		}
	}, [loadNft])

	const handleClose = useCallback(() => {
		window.history.back()
	}, [])

	if (!nft) return null

	return (
		<dialog
			style={{
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				position: 'fixed',
				paddingTop: '60px',
				backgroundColor: 'rgba(0,0,0,0.1)',
				zIndex: 1,
			}}
			open
		>
			<Modal onClose={handleClose}>
				<NftInfo {...nft} />
			</Modal>
		</dialog>
	)
}
