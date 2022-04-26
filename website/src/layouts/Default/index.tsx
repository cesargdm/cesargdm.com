import * as React from 'react'
import { Helmet } from 'react-helmet'

import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

import './reset.css'
import './global.css'

import * as Styles from './styles'

interface Props {
  locale: 'en' | 'es'
  children: React.ReactElement
}

function DefaultLayout({ children, locale }: Props) {
  return (
    <Styles.Container>
      <Helmet>
        <meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script data-host="https://microanalytics.io" data-dnt="false" src="https://microanalytics.io/js/script.js" id="ZwSg9rf6GA" async defer />
        <html lang={locale} />
        <title>César Guadarrama</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Helmet>
      <Nav locale={locale} />
      {children}
      <Footer locale={locale} />
    </Styles.Container>
  )
}

export default DefaultLayout
