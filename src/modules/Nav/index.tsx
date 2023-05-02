import Link from 'next/link'
import styles from './nav.module.css'

function Nav() {
	return (
		<nav className={styles.container}>
			<ul className={styles.list}>
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
			<ul className={styles.list}>
				<li>Dark</li>
			</ul>
		</nav>
	)
}

export default Nav
