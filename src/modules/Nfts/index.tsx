import { IconArrowUpRight, IconArtboard } from '@tabler/icons-react'
import Link from 'next/link'

import { headingLink, listContainer } from '@/modules/Nfts/styles.css'

import { BASE_URL } from '@/lib/constants'
import type { Locale } from '@/lib/i18n'

import NftList from './NftsList'

function getData() {
	// eslint-disable-next-line no-magic-numbers
	const ONE_DAY = 60 * 60 * 24

	return fetch(`${BASE_URL}/api/nfts`, {
		method: 'GET',
		next: { revalidate: ONE_DAY },
	})
		.then(
			(response) =>
				response.json() as Promise<{ name: string; image_url: string }[]>,
		)
		.catch(() => undefined)
}

async function Nfts({ locale }: { locale: Locale }) {
	const data = await getData()

	if (!data?.length) {
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
