import * as React from 'react'

import * as Styles from './styles'

import twitter from './twitter.svg'
import linkedIn from './linkedin.svg'

function SocialShare({ url }: { url: string }): JSX.Element {
  return (
    <Styles.Container>
      <a
        rel="noreferrer noopenner"
        target="_blank"
        href={`https://twitter.com/intent/tweet?text=${url}`}
      >
        <Styles.SocialIcon src={twitter} alt="Twittter icon" />
      </a>
      <a
        rel="noreferrer noopenner"
        target="_blank"
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
      >
        <Styles.SocialIcon src={linkedIn} alt="LinkedIn icon" />
      </a>
    </Styles.Container>
  )
}

export default SocialShare
