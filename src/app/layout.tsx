import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import classNames from 'classnames'

import Nav from '@/modules/Nav'
import Footer from '@/modules/Footer'

import { content } from './styles.css'
import { themeClass } from './theme.css'
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
			<Script id="show-banner" strategy="afterInteractive">
				{`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
					posthog.init('phc_LYzVp8FqTq7hFSntNPoyNpERu096OwajZvwxQJbExUk',{api_host:'https://app.posthog.com'})`}
			</Script>
			<body className={classNames(inter.className, themeClass)}>
				<Nav />
				<div className={content}>{children}</div>
				<Footer />
			</body>
		</html>
	)
}
