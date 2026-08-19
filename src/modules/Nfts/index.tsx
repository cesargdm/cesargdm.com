import { IconArrowUpRight, IconArtboard } from '@tabler/icons-react'
import Link from 'next/link'

import { headingLink, listContainer } from '@/modules/Nfts/styles.css'

import type { Locale } from '@/lib/i18n'
import { getNfts } from '@/lib/open-sea'

import NftList from './NftsList'

async function Nfts({ locale }: { locale: Locale }) {
	const data = await getNfts()

	if (!data.length) {
		return null
	}

	return (
		<>
			<Link className={headingLink} href={`/${locale}/nfts`}>
				<h2>
					<IconArtboard aria-hidden />
					NFTs
				</h2>
				<IconArrowUpRight />
			</Link>
			<div className={listContainer}>
				<NftList data={data} />
			</div>
		</>
	)
}

export default Nfts
