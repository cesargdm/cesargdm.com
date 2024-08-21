import { Suspense } from 'react'
import classNames from 'classnames'
import { cookies } from 'next/headers'

import type { Theme } from '@/modules/Nav/ToggleTheme/ThemeButton'
import { CookieName } from '@/modules/Nav/ToggleTheme/ThemeButton'

import type { Locale } from '@/lib/i18n'

import StaticNavList from './NavList/StaticNavList'
import NavList from './NavList'
import ToggleTheme from './ToggleTheme'

import { navContainer, navList, navToggleThemeItem } from './styles.css'

export default function Nav({ locale }: { locale: Locale }) {
	const cookieStore = cookies()
	const cookieTheme = cookieStore.get(CookieName)?.value as Theme

	return (
		<nav className={navContainer}>
			<i aria-hidden />

			<Suspense fallback={<StaticNavList locale={locale} />}>
				<NavList locale={locale} />
			</Suspense>

			<ul className={classNames(navList, navToggleThemeItem)}>
				<li>
					<ToggleTheme initialTheme={cookieTheme} />
				</li>
			</ul>
		</nav>
	)
}
