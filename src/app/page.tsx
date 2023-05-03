import Chat from '@/modules/Chat'
import LastTweet from '@/modules/LastTweet'

import { card, cards, chat, introContainer, introParagraph } from './styles.css'

function Home() {
	return (
		<div>
			<div className={introContainer}>
				<h1>Hi!</h1>
				<p className={introParagraph}>
					{`I'm a dedicated Product Engineer with a passion for creating
					delightful and functional user experiences. On a daily basis, I work
					my magic 🪄 with TypeScript, crafting seamless user interfaces using
					React, while powering the backend with Node, GraphQL, and MongoDB. I'm
					working in the awesome startup OCHO and my side project Cretia; before
					that I've been part of amazing teams such as Tesorio, Aura, Covalto
					(prev. Credijusto) and IBM. And since I cannot sit still, I've created
					some projects.`}
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
						{/* @ts-ignore */}
						<LastTweet />
					</div>
				</li>
				<li>
					<div className={card}>
						<h2>Reading</h2>
						<p>Current book</p>
					</div>
				</li>
				<li>
					<div className={card}>
						<h2>Cretia</h2>
						<p>LOGO</p>
					</div>
				</li>
				<li>
					<div className={card}>
						<h2>Unsplash</h2>
						<p>Last photo</p>
					</div>
				</li>
			</ul>
		</div>
	)
}

export default Home
