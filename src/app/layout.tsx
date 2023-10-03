import { Analytics } from '@vercel/analytics/react'
import classNames from 'classnames'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import type { ReactNode } from 'react'

import Footer from '@/modules/Footer'
import Nav from '@/modules/Nav'

import { metadata as defaultMetadata } from '@/lib/metadata'

import './globals.css'
import { body, content } from './styles.css'
import { darkTheme, lightTheme, responsiveTheme } from './theme.css'

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

type Props = {
	children: ReactNode
	modal: ReactNode
}

export const metadata = defaultMetadata

export default function RootLayout({ children, modal }: Props) {
	const cookieStore = cookies()
	const theme = cookieStore.get('theme')?.value

	return (
		<html
			className={classNames(inter.className, {
				[responsiveTheme]: !theme,
				[darkTheme]: theme === 'dark',
				[lightTheme]: theme === 'light',
			})}
			lang="en"
		>
			<meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
			<body className={body}>
				<Nav />
				<main className={content}>{children}</main>
				{modal}
				<Footer />
				<Analytics />
			</body>
		</html>
	)
}
