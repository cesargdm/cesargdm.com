'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'

import { navItem, navLink, navLinkActive } from './styles.css'

export default function NavLink({
	href,
	children,
	exact = false,
}: {
	href: string
	children: string
	exact?: boolean
}) {
	const pathname = usePathname()
	const isActive = exact ? pathname === href : pathname.startsWith(href)

	return (
		<li className={navItem}>
			<Link
				tabIndex={-1}
				className={classNames(navLink, isActive && navLinkActive)}
				href={href}
			>
				{children}
			</Link>
		</li>
	)
}
