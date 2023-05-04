import { IconBook } from '@tabler/icons-react'

import Chat from '@/modules/Chat'
import Mint from '@/modules/Mint'
import LastPhoto from '@/modules/LastPhoto'
import LastTweet from '@/modules/LastTweet'
import HoverCompany from '@/modules/HoverCompany'
import Cretia from '@/assets/icons/Cretia'

import {
	card,
	cards,
	chat,
	cretiaCard,
	dropdownText,
	introContainer,
	introParagraph,
} from './styles.css'
import Link from 'next/link'
import { Suspense } from 'react'

function Home() {
	return (
		<div>
			<div className={introContainer}>
				<h1>Hi!</h1>
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
			<ul className={cards}>
				<li className={chat}>
					<div className={card}>
						<Chat />
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
						<h2>
							<IconBook aria-hidden />
							Reading
						</h2>
						<p>Current book</p>
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
				<li>
					<div className={card}>
						<Suspense fallback={null}>
							<Mint />
						</Suspense>
					</div>
				</li>
			</ul>
		</div>
	)
}

export default Home
