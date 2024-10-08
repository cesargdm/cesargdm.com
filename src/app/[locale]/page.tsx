import { Suspense } from 'react'
import classNames from 'classnames'
import { cookies } from 'next/headers'
import Link from 'next/link'

import Chat from '@/modules/Chat'
import HoverCompany from '@/modules/HoverCompany'
import LastPhoto from '@/modules/LastPhoto'
import LastTweet from '@/modules/LastPost'
import Nfts from '@/modules/Nfts'
import Reading from '@/modules/Reading'

import { getCheerFromVisitsCount } from '@/lib/cheer'
import type { PageProps } from '@/lib/types'

import {
	card,
	cardsList,
	introContainer,
	introParagraph,
	twoColumnCard,
} from './styles.css'

export default function Home({ params }: PageProps) {
	const { get } = cookies()

	const visitsCount = get('visits-count')?.value || '1'

	return (
		<div>
			<div className={introContainer}>
				<h1>Hi {getCheerFromVisitsCount(visitsCount)}!</h1>
				<p className={introParagraph}>
					I&apos;m a dedicated Product Engineer with a passion for creating
					delightful and functional user experiences. On a daily basis, I work
					my magic 🪄 with TypeScript, crafting seamless user interfaces using
					React, while powering the backend with Node, GraphQL, and MongoDB.
					I&apos;m working in the awesome startup{' '}
					<HoverCompany>OCHO</HoverCompany> and my side project{' '}
					<HoverCompany>Cretia</HoverCompany>; before that I&apos;ve been part
					of amazing teams such as <HoverCompany>Tesorio</HoverCompany>,{' '}
					<HoverCompany>Aura</HoverCompany>,{' '}
					<HoverCompany>Covalto</HoverCompany> and{' '}
					<HoverCompany>IBM</HoverCompany>. And since I cannot sit still,
					I&apos;ve created some cool <Link href="/projects">projects</Link>.
				</p>
			</div>
			<Suspense
				fallback={
					<ul className={cardsList}>
						<li className={card}></li>
						<li className={card}></li>
						<li className={card}></li>
						<li className={card}></li>
					</ul>
				}
			>
				<ul className={cardsList}>
					<li
						className={classNames(card, twoColumnCard)}
						style={{ height: '100%' }}
					>
						<Suspense fallback={null}>
							<Chat locale={params.locale} />
						</Suspense>
					</li>
					<li style={{ aspectRatio: '1 / 1' }} className={card}>
						<Suspense fallback={null}>
							<LastTweet />
						</Suspense>
					</li>
					<li style={{ padding: 0 }} className={card}>
						<Suspense fallback={null}>
							<LastPhoto />
						</Suspense>
					</li>
					<li style={{ padding: 0, aspectRatio: '1 / 1' }} className={card}>
						<Suspense fallback={null}>
							<Nfts locale={params.locale} />
						</Suspense>
					</li>
					<li
						className={classNames(card, twoColumnCard)}
						style={{ padding: 0 }}
					>
						<Suspense fallback={null}>
							<Reading />
						</Suspense>
					</li>
				</ul>
			</Suspense>
		</div>
	)
}
