import React from 'react'
import styled from 'styled-components'

const Container = styled.footer`
  background-color: #fcfcfc;
  padding: 25px 10px;
`

const Content = styled.div`
  max-width: var(--sizes--content_max_width);
  margin: 0 auto;
  width: 100%;
  text-align: center;
  font-size: 0.85rem;

  ul {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  a {
    opacity: 0.8;
    text-decoration: none;
    color: inherit;
    font-weight: 600;
  }
`

function Footer() {
  return (
    <Container>
      <Content>
        <ul>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/cesargdm"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://500px.com/cesargdm"
            >
              500px
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://linkedin.com/in/cesargdm"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://twitter.com/cesargdm"
            >
              Twitter
            </a>
          </li>
        </ul>
        <p>
          César Guadarrama © {new Date().getFullYear()}, Illustrations by{' '}
          <a href="https://weshouldbeblue.com">@weshouldbeblue</a>
        </p>
        <p style={{ fontSize: '0.6rem', marginTop: 10, opacity: 0.3 }}>
          Analytics data is public in{' '}
          <a href="https://microanalytics.io/cesargdm.com">Microanalytics</a>,
          source code available at{''}
          <a href="https://www.github.com/cesargdm/cesargdm.com">GitHub</a>
        </p>
      </Content>
    </Container>
  )
}

export default Footer
