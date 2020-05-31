import * as React from 'react'
import { graphql } from 'gatsby'
import PortableText from '@sanity/block-content-to-react'

import DefaultLayout from '../../layouts/Default'
import localize from '../../utils/localize'

import * as Styles from './styles'

const { GATSBY_SANITY_PROJECT_ID } = process.env
const { GATSBY_SANITY_DATASET } = process.env

function Gallery(props: unknown) {
  const {
    data,
    pathContext: { locale },
  } = props

  const localized = localize(data.gallery, [locale]) as any

  return (
    <DefaultLayout locale={locale}>
      <Styles.GalleryContainer>
        <h1>{localized.title}</h1>
        <PortableText
          projectId={GATSBY_SANITY_PROJECT_ID}
          dataset={GATSBY_SANITY_DATASET}
          blocks={localized._rawBody}
        />
      </Styles.GalleryContainer>
    </DefaultLayout>
  )
}

export default Gallery

export const query = graphql`
  query($_id: String) {
    gallery: sanityGallery(_id: { eq: $_id }) {
      slug

      title {
        _type
        en
        es
      }

      _rawBody
    }
  }
`
