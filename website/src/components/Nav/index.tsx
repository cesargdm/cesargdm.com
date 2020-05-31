import * as React from 'react'
import { useViewportScroll, motion } from 'framer-motion'
import { Link } from 'gatsby'

import * as Styles from './styles'

const messages = {
  en: {
    me: 'Me',
    blog: 'Blog',
    photos: 'Photos',
  },
  es: {
    me: 'Yo',
    blog: 'Blog',
    photos: 'Fotos',
  },
}

const spring = {
  type: 'spring',
  damping: 200,
  stiffness: 300,
}

const initialOpacity = 0.6

function Nav({ locale }: { locale: 'es' | 'en' }): JSX.Element {
  const localePrefix = locale === 'en' ? '' : 'es'

  const { scrollY } = useViewportScroll()

  const [showMe, setShowMe] = React.useState(null)

  React.useEffect(() => {
    scrollY.onChange((e) => {
      setShowMe(scrollY.prev < e)
    })
  })

  const textAnimation = {
    initial: showMe !== null && { y: -40, opacity: initialOpacity },
    animate: showMe !== null && { y: 0, opacity: 1 },
    transition: spring,
  }

  return (
    <Styles.Container
      onFocus={(): void => setShowMe(false)}
      onMouseOver={(): void => setShowMe(false)}
    >
      <Styles.Content>
        <ul>
          <li>
            <Link to={`/${localePrefix}`}>
              {showMe ? (
                <motion.div
                  // Re-render this element so animation is performed
                  key={String(showMe)}
                  transition={spring}
                  initial={{ y: 40, opacity: initialOpacity }}
                  animate={{ y: 4, opacity: 1 }}
                >
                  <Styles.MeIcon />
                </motion.div>
              ) : (
                <motion.div {...textAnimation}>
                  {messages[locale].me}
                </motion.div>
              )}
            </Link>
          </li>
          {!showMe && (
            <>
              <motion.li {...textAnimation}>
                <Link to={`/${localePrefix}/blog`}>
                  {messages[locale].blog}
                </Link>
              </motion.li>
              <motion.li {...textAnimation}>
                <Link to={`/${localePrefix}/photos`}>
                  {messages[locale].photos}
                </Link>
              </motion.li>
            </>
          )}
        </ul>
      </Styles.Content>
    </Styles.Container>
  )
}

export default Nav
