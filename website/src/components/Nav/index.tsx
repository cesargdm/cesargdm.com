import * as React from 'react'
import { Link } from 'gatsby'

import * as Styles from './styles'

const messages = {
  me: {
    en: 'Me',
    es: 'Yo',
  },
  blog: {
    en: 'Blog',
    es: 'Blog',
  },
  photos: {
    en: 'Photos',
    es: 'Fotos',
  },
}

function Layout({ locale }: { locale: 'es' | 'en' }) {
  const localePrefix = locale === 'en' ? '' : 'es'

  return (
    <Styles.Container>
      <Styles.Content>
        <ul>
          <li>
            <Link to={`/${localePrefix}`}>{messages.me[locale]}</Link>
          </li>
          <li>
            <Link to={`/${localePrefix}/blog`}>{messages.blog[locale]}</Link>
          </li>
          <li>
            <Link to={`/${localePrefix}/photos`}>
              {messages.photos[locale]}
            </Link>
          </li>
        </ul>
      </Styles.Content>
    </Styles.Container>
  )
}

export default Layout
