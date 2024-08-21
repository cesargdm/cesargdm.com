import Modal from '@/components/Modal'
import NftInfo from '@/components/Nft'

import { findNft, getNfts } from '@/lib/open-sea'

type Props = {
	params: { id: string }
}

export default async function Nft(props: Props) {
	const {
		params: { id },
	} = props

	if (!id) {
		return null
	}

	const nfts = await getNfts()

	if (!nfts) {
		return null
	}

	const nft = findNft(nfts, id)

	if (!nft) {
		return null
	}

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
			<Modal>
				<NftInfo {...nft} />
			</Modal>
		</dialog>
	)
}
