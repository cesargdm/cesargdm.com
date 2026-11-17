import type { Locale } from '@/lib/i18n'
import { getTranslate } from '@/lib/translate'

import NavLink from '../NavLink'

export default function StaticNavList({
	locale,
	pathname,
}: {
	locale: Locale
	pathname: string
}) {
	const t = getTranslate(locale)

	return (
		<>
			<NavLink href={`/${locale}`} pathname={pathname} exact>
				{t('nav.about')}
			</NavLink>
			<NavLink href={`/${locale}/projects`} pathname={pathname}>
				{t('nav.projects')}
			</NavLink>
			<NavLink href={`/${locale}/blog`} pathname={pathname}>
				{t('nav.blog')}
			</NavLink>
			<NavLink href={`/${locale}/contact`} pathname={pathname}>
				{t('contact.title')}
			</NavLink>
		</>
	)
}
