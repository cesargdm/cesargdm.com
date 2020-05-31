import * as React from 'react'

import * as Styles from './styles'

import twitter from './twitter.svg'
import linkedIn from './linkedIn.svg'

function SocialShare(): JSX.Element {
  return (
    <Styles.Container>
      <a
        rel="noreferrer noopenner"
        className="twitter-share-button"
        href={`https://twitter.com/intent/tweet?text=${window.location.href}`}
      >
        <Styles.SocialIcon src={twitter} alt="Twittter icon" />
      </a>
      <a
        rel="noreferrer noopenner"
        target="_blank"
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}`}
      >
        <Styles.SocialIcon src={linkedIn} alt="LinkedIn icon" />
      </a>
    </Styles.Container>
  )
}

export default SocialShare
