import type { Locale } from '@/lib/i18n'

import NavLink from '../NavLink'

export default function StaticNavList({ locale }: { locale: Locale }) {
	return (
		<>
			<NavLink href={`/${locale}`} exact>
				About
			</NavLink>
			<NavLink href={`/${locale}/projects`}>Projects</NavLink>
			<NavLink href={`/${locale}/blog`}>Blog</NavLink>
			<NavLink href={`/${locale}/contact`}>Contact</NavLink>
		</>
	)
}
