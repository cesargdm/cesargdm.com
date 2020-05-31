import * as React from 'react'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

import * as Styles from './styles'

function Gallery(props) {
  const { title, slug, hero } = props

  return (
    <Link to={`/photos/${slug}`}>
      <Styles.Hero>
        <Img fixed={hero.asset.fixed} />
        <h6>{title}</h6>
      </Styles.Hero>
    </Link>
  )
}

export default Gallery
