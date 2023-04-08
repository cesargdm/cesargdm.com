import React, { type ReactElement } from 'react'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet-async'

import Nav from '../modules/Nav'
import Footer from '../modules/Footer'

import './reset.css'
import './main.css'

const Container = styled.main`
	min-height: 100vh;
	padding: 10px;
	padding-top: var(--sizes--nav_height);
	display: flex;
`

const Content = styled.div`
	max-width: var(--sizes--content_max_width);
	margin: 0 auto;
	width: 100%;
	position: relative;
	padding-right: env(safe-area-inset-right);
	padding-left: env(safe-area-inset-left);
`

type Props = {
	title?: string
	children: React.ReactNode
}

function Template({ title, children }: Props): ReactElement {
	return (
		<>
			<Helmet
				htmlAttributes={{ lang: 'en-US' }}
				defaultTitle="cesargdm"
				titleTemplate="%s | cesargdm"
			>
				<title>{title}</title>
				<meta
					name="description"
					content="Cesar Guadarrama • Web and product engineer • @cesargdm"
				/>
				<meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
				<meta charSet="utf-8" />
				<script>
					{`
						!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
						posthog.init('phc_C2nyPZmI37N1ZV4UTV7qT5QrzpXwFVm9xuXTZf5fYrF',{api_host:'https://app.posthog.com'})
					`}
				</script>
			</Helmet>
			<Nav />
			<Container>
				<Content>{children}</Content>
			</Container>
			<Footer />
		</>
	)
}

export default Template
