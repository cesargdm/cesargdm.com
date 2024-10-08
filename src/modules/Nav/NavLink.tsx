'use client'

import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navItem, navLink, navLinkActive } from './styles.css'

type Props = {
	href: string
	children: string
	exact?: boolean
}

export default function NavLink({ href, children, exact = false }: Props) {
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
