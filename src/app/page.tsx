import { Suspense } from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'

import Chat from '@/modules/Chat'
import Reading from '@/modules/Reading'
import Cretia from '@/assets/icons/Cretia'
import LastPhoto from '@/modules/LastPhoto'
import LastTweet from '@/modules/LastTweet'
import HoverCompany from '@/modules/HoverCompany'

import { getCheerFromVisitsCount } from '@/lib/cheer'

import {
	card,
	cards,
	chat,
	cretiaCard,
	introContainer,
	introParagraph,
} from './styles.css'

export const runtime = 'edge'

export default function Home() {
	const cookieStore = cookies()
	const visitsCount = cookieStore.get('visits-count')?.value || '1'

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
					<ul className={cards}>
						<li className={card}></li>
						<li className={card}></li>
						<li className={card}></li>
						<li className={card}></li>
					</ul>
				}
			>
				<ul className={cards}>
					<li className={chat}>
						<div className={card}>
							<Suspense fallback={null}>
								<Chat />
							</Suspense>
						</div>
					</li>
					<li>
						<div className={card}>
							<Suspense fallback={null}>
								{/* @ts-ignore */}
								<LastTweet />
							</Suspense>
						</div>
					</li>
					<li>
						<div className={card}>
							<Reading />
						</div>
					</li>
					<li>
						<a
							aria-label="Visit Cretia website"
							href="https://about.cretia.app?utm_source=cesargdm"
							className={cretiaCard}
						>
							<Cretia
								style={{ maxWidth: 100, justifySelf: 'center', margin: 'auto' }}
								aria-hidden
							/>
						</a>
					</li>
					<li>
						<div className={card}>
							<Suspense fallback={null}>
								{/* @ts-ignore */}
								<LastPhoto />
							</Suspense>
						</div>
					</li>
				</ul>
			</Suspense>
		</div>
	)
}
