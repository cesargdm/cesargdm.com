import { type ReactNode, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import classNames from 'classnames'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'

import Footer from '@/modules/Footer'
import Nav from '@/modules/Nav'
import { CookieName as ThemeCookieName } from '@/modules/Nav/ToggleTheme/ThemeButton'

import { getMetadata } from '@/lib/metadata'
import type { PageProps } from '@/lib/types'

import { darkTheme, lightTheme, responsiveTheme } from '@/app/theme.css'

import '@/app/globals.css'
import { body, content } from './styles.css'

const inter = Inter({
	subsets: ['latin'],
	weight: ['100', '400', '700', '900'],
	variable: '--fonts--inter',
	fallback: [
		'system-ui',
		'-apple-system',
		'BlinkMacSystemFont',
		'Segoe UI',
		'Roboto',
		'Oxygen',
		'Ubuntu',
		'Cantarell',
		'Open Sans',
		'Helvetica Neue',
		'sans-serif',
	],
})

type Props = PageProps<{
	children: ReactNode
	modal: ReactNode
}>

export const generateMetadata = getMetadata()

export default function RootLayout({ children, modal, params }: Props) {
	const cookieStore = cookies()
	const theme = cookieStore.get(ThemeCookieName)?.value

	return (
		<html
			className={classNames(inter.className, {
				[responsiveTheme]: !theme,
				[darkTheme]: theme === 'dark',
				[lightTheme]: theme === 'light',
			})}
			lang={params.locale}
		>
			<meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
			<body className={body}>
				<Nav locale={params.locale} />

				<main className={content}>
					<Suspense fallback={null}>{children}</Suspense>
				</main>

				{modal}

				<Footer locale={params.locale} />

				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
