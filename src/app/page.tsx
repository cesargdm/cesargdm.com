import { card, cards, chat } from './styles.css'

function Home() {
	return (
		<main>
			<div>
				<h1>Hi!</h1>
				<p>
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
						<h2>Chat</h2>
						<div>
							<ul>
								<li>Message</li>
								<li>Message</li>
								<li>Message</li>
							</ul>
							<form>
								<input type="text" />
								<input type="submit" />
							</form>
						</div>
					</div>
				</li>
				<li>
					<div className={card}>
						<h2>Tweets</h2>
						<p>Last tweet</p>
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
		</main>
	)
}

export default Home
