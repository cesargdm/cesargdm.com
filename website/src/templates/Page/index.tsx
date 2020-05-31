import * as React from 'react'
import { graphql } from 'gatsby'
import PortableText from '@sanity/block-content-to-react'

import DefaultLayout from '../../layouts/Default'
import localize from '../../utils/localize'
import serializers from '../../utils/serializers'

import * as Styles from '../Page/styles'

import me from './me.svg'

function Page(props: any) {
  const {
    pathContext: { locale, slug },
    data,
  } = props

  const page = localize(data.page, [locale]) as any
  const gallery = localize(data.gallery, [locale]) as any

  const isHome = slug === null

  return (
    <DefaultLayout locale={locale}>
      <Styles.Content>
        {isHome ? (
          <Styles.MeContainer>
            <img src={me} height={200} alt="" />
            <h1>César Guadarrama</h1>
          </Styles.MeContainer>
        ) : (
          <h1>{page.title}</h1>
        )}
        {page._rawBody && (
          <PortableText
            serializers={serializers.pageSerializers(gallery.nodes)}
            blocks={page._rawBody}
          />
        )}
      </Styles.Content>
    </DefaultLayout>
  )
}

export default Page

export const query = graphql`
  query($slug: String) {
    page: sanityPage(slug: { eq: $slug }) {
      slug
      title {
        _type
        en
        es
      }

      _rawBody
    }

    gallery: allSanityGallery {
      nodes {
        slug
        title {
          _type
          en
          es
        }

        hero {
          _key
          _type

          caption

          asset {
            fixed(width: 900) {
              ...GatsbySanityImageFixed
            }
          }
        }
      }
    }
  }
`
