import classNames from 'classnames'

import NavLink from './NavLink'
import ToggleTheme from './ToggleTheme'

import {
	centerNavList,
	navContainer,
	navList,
	navToggleThemeItem,
} from './styles.css'

function Nav() {
	return (
		<nav className={navContainer}>
			<i aria-hidden />
			{/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
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
