import Link from 'next/link'

import { container, list } from './styles.css'

import ToggleTheme from './ToggleTheme'

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
					<Link href="/contact">Contact</Link>
				</li>
			</ul>
			<ul className={list}>
				<li>
					<ToggleTheme />
				</li>
			</ul>
		</nav>
	)
}

export default Nav
