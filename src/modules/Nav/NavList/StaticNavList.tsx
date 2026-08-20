import type { Locale } from '@/lib/i18n'

import NavLink from '../NavLink'

export default function StaticNavList({
	locale,
	pathname,
}: {
	locale: Locale
	pathname: string
}) {
	return (
		<>
			<NavLink href={`/${locale}`} pathname={pathname} exact>
				About
			</NavLink>
			<NavLink href={`/${locale}/projects`} pathname={pathname}>
				Projects
			</NavLink>
			<NavLink href={`/${locale}/blog`} pathname={pathname}>
				Blog
			</NavLink>
			<NavLink href={`/${locale}/contact`} pathname={pathname}>
				Contact
			</NavLink>
		</>
	)
}
