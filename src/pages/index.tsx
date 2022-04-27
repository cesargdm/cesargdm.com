/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import styled from 'styled-components'

import Template from '../templates'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;

  a {
    text-decoration: none;
    padding: 0;
    height: auto;
    display: inline;
    color: inherit;
    font-weight: 700;
  }
`

const blankProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
}

function Index() {
  return (
    <Template>
      <Content>
        <p>Hi</p>
        <p>
          I'm a software engineer and photographer from México. I use TypeScript
          on my daily basis, React and React Native for user interfaces, and
          Node + GraphQL whenever I can.
        </p>
        <p>
          As today I'm working in an awesome company{' '}
          <a {...blankProps} href="https://www.ocho.co">
            Ocho
          </a>{' '}
          and my startup{' '}
          <a {...blankProps} href="https://www.cretia.app">
            Cretia
          </a>
          ; before that I've worked at{' '}
          <a {...blankProps} href="https://tesorio.com">
            Tesorio
          </a>
          ,{' '}
          <a {...blankProps} href="https://myaura.com">
            Aura
          </a>
          ,{' '}
          <a {...blankProps} href="https://covalto.com">
            Covalto
          </a>{' '}
          (prev. Credijusto) and IBM, but I've also developed some interesting
          products with{' '}
          <a {...blankProps} href="https://fucesa.com">
            Fucesa
          </a>
          .
        </p>
      </Content>
    </Template>
  )
}

export default Index
