import {
	navList,
	navContainer,
	centerNavList,
	navToggleThemeItem,
} from './styles.css'

import ToggleTheme from './ToggleTheme'

import NavLink from './NavLink'
import classNames from 'classnames'

function Nav() {
	return (
		<nav className={navContainer}>
			<i aria-hidden />
			<ul tabIndex={0} className={centerNavList}>
				<NavLink href="/" exact>
					About
				</NavLink>
				<NavLink href="/projects">Projects</NavLink>
				<NavLink href="/blog">Blog</NavLink>
				<NavLink href="/contact">Contact</NavLink>
			</ul>
			<ul className={classNames(navList, navToggleThemeItem)}>
				<li>
					<ToggleTheme />
				</li>
			</ul>
		</nav>
	)
}

export default Nav
