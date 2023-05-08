import { ReactNode } from 'react'
import classNames from 'classnames'
import { cookies } from 'next/headers'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

import Nav from '@/modules/Nav'
import Footer from '@/modules/Footer'

import { body, content } from './styles.css'
import { darkTheme, lightTheme, responsiveTheme } from './theme.css'
import './globals.css'

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

export default function RootLayout({ children }: { children: ReactNode }) {
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
				{/* @ts-ignore */}
				<Footer />
				<Analytics />
			</body>
		</html>
	)
}
