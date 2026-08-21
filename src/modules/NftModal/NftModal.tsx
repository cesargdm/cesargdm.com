import { useCallback, useEffect, useRef, useState } from 'react'

import Modal from '@/components/Modal'
import NftInfo from '@/components/Nft'

import { readJson } from '@/lib/json'
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
	const dialogRef = useRef<HTMLDialogElement>(null)
	// Set right before we close the dialog ourselves (in the effect below) so
	// the resulting native "close" event — indistinguishable from an Escape-key
	// close — doesn't also trigger a second, redundant history.back().
	const closingProgrammatically = useRef(false)

	const loadNft = useCallback(async (id: string) => {
		try {
			const response = await fetch(`/api/nfts/${id}`)
			if (!response.ok) return
			const data = await readJson<Nft>(response)
			setNft(data)
		} catch {
			// ignore
		}
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

	// `showModal()`/`close()` are imperative DOM APIs, not props — this is what
	// gives the dialog its native focus trap, top-layer `aria-modal` semantics,
	// initial focus, and focus-return-to-trigger on close. Setting the `open`
	// attribute directly (the previous approach) opts out of all of that.
	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return

		if (nft && !dialog.open) {
			dialog.showModal()
		} else if (!nft && dialog.open) {
			closingProgrammatically.current = true
			dialog.close()
		}
	}, [nft])

	// Escape closes the dialog natively before this fires, which would leave
	// the pushed history entry (and URL) out of sync with the now-closed
	// dialog — so this is what reconciles them for that path.
	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return

		function handleDialogClose() {
			if (closingProgrammatically.current) {
				closingProgrammatically.current = false
				return
			}
			handleClose()
		}

		dialog.addEventListener('close', handleDialogClose)
		return () => dialog.removeEventListener('close', handleDialogClose)
	}, [handleClose])

	return (
		<dialog
			ref={dialogRef}
			aria-label={nft?.name}
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
		>
			{nft ? (
				<Modal onClose={handleClose}>
					<NftInfo {...nft} />
				</Modal>
			) : null}
		</dialog>
	)
}
