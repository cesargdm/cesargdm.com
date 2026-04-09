import { Suspense } from 'react'
import classNames from 'classnames'
import Link from 'next/link'

import Chat from '@/modules/Chat'
import LastPhoto from '@/modules/LastPhoto'
import LastTweet from '@/modules/LastPost'
import Nfts from '@/modules/Nfts'
import Reading from '@/modules/Reading'
import Strava from '@/modules/Strava'

import type { PageProps } from '@/lib/types'

import {
	card,
	cardsList,
	homeSection,
	homeSectionBody,
	homeSectionTitle,
	introContainer,
	introCtaRow,
	introParagraph,
	introTrustBar,
	twoColumnCard,
} from './styles.css'

export default function Home({ params }: PageProps) {
	return (
		<div>
			<div className={introContainer}>
				<h1>Your strategy is only as good as what gets shipped.</h1>
				<p className={introParagraph}>
					We turn briefs into delivered outcomes across design, marketing,
					and engineering—with clear ownership, cadence, and quality control.
				</p>
				<div className={introCtaRow}>
					<Link href='/contact'>Start a project</Link>
					<Link href='/projects'>See how we work</Link>
				</div>
				<p className={introTrustBar}>
					Trusted by growth-stage teams that need execution certainty.
				</p>
			</div>

			<section className={homeSection}>
				<h2 className={homeSectionTitle}>
					Cross-functional delivery, one accountable team.
				</h2>
				<p className={homeSectionBody}>
					From brand systems and campaigns to product experiences and
					technical implementation, we coordinate specialists and ship
					work that moves business metrics.
				</p>
			</section>

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
					<li style={{ aspectRatio: '1 / 1' }} className={card}>
						<Suspense fallback={null}>
							<Strava />
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
