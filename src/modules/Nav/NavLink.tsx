import classNames from 'classnames'

import { navItem, navLink, navLinkActive } from './styles.css'

type Props = {
	href: string
	children: string
	pathname: string
	exact?: boolean
}

export default function NavLink({
	href,
	children,
	pathname,
	exact = false,
}: Props) {
	const isActive = exact ? pathname === href : pathname.startsWith(href)

	return (
		<li className={navItem}>
			<a
				tabIndex={-1}
				className={classNames(navLink, isActive && navLinkActive)}
				href={href}
			>
				{children}
			</a>
		</li>
	)
}
