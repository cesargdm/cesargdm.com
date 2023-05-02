import Link from 'next/link'
import { container, list } from './styles.css'

function Nav() {
	return (
		<nav className={container}>
			<ul className={list}>
				<li>
					<Link href="/">Home</Link>
				</li>
				<li>
					<Link href="/projects">Projects</Link>
				</li>
				<li>
					<Link href="/blog">Blog</Link>
				</li>
				<li>
					<Link href="/cv">CV</Link>
				</li>
			</ul>
			<ul className={list}>
				<li>Dark</li>
			</ul>
		</nav>
	)
}

export default Nav
