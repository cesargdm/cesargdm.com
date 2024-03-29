import { IconArtboard } from '@tabler/icons-react'

import { vars } from '@/app/theme.css'

import NftList from './NftsList'

function getData(): Promise<any[]> {
	// eslint-disable-next-line no-magic-numbers
	const ONE_DAY = 60 * 60 * 24

	return fetch('https://cesargdm.com/api/nfts', {
		method: 'GET',
		next: { revalidate: ONE_DAY },
	})
		.then((response) => response.json())
		.catch(() => undefined)
}

async function Nfts() {
	const data = await getData()

	if (!data?.length) return null

	return (
		<>
			<div
				style={{
					display: 'flex',
					gap: vars.space.small,
					textDecoration: 'none',
					padding: 16,
				}}
			>
				<IconArtboard />
				<h2>NFTs</h2>
			</div>
			<div
				style={{ position: 'relative', height: '100%', flex: 1, minHeight: 0 }}
			>
				<NftList data={data} />
			</div>
		</>
	)
}

export default Nfts
