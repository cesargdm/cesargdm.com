import * as React from 'react'
import { Link } from 'gatsby'

import * as Styles from './styles'

const messages = {
  en: {
    illustrationsBy: 'Illustrations by ',
  },
  es: {
    illustrationsBy: 'Ilustraciones por ',
  },
}

function Footer({ locale }: { locale: 'es' | 'en' }) {
  return (
    <Styles.Container>
      <p>
        <Link to={locale === 'en' ? '/es' : '/'}>
          {locale === 'en' ? 'Español' : 'English'}
        </Link>
      </p>
      <ul>
        <li>
          <a href="https://github.com/cesargdm">GitHub</a>
        </li>
        <li>
          <a href="https://500px.com/cesargdm">500px</a>
        </li>
        <li>
          <a href="https://linkedin.com/in/cesargdm">LinkedIn</a>
        </li>
        <li>
          <a href="https://twitter.com/cesargdm">Twitter</a>
        </li>
        <li>
          <a href="https://github.com/cesargdm/cesargdm.com">Source</a>
        </li>
      </ul>
      <p>
        César Guadarrama © 2020, {messages[locale].illustrationsBy}
        <a href="https://weshouldbeblue.com">@weshouldbeblue</a>
      </p>
    </Styles.Container>
  )
}

export default Footer
