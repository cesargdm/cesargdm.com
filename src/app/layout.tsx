import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import Nav from '../modules/Nav'
import Footer from '../modules/Footer'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'César',
	description: 'César Guadarrama - Software product engineer',
	['og:title']: 'César',
	['og:description']: 'César Guadarrama - Software product engineer',
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
			<body className={inter.className}>
				<Nav />
				{children}
				<Footer />
			</body>
		</html>
	)
}
