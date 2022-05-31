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
        <p>Hi!</p>
        <p>
          I'm a product engineer and photographer. I use TypeScript on my daily
          basis, React for user interfaces, and Node GraphQL and MongoDB for
          that server magic 🪄... but I also work on the web3 by night.
        </p>
        <p>
          As today I'm working in the awesome startup{' '}
          <a {...blankProps} href="https://www.ocho.co">
            OCHO
          </a>{' '}
          and my side project{' '}
          <a {...blankProps} href="https://www.cretia.app">
            Cretia
          </a>
          ; before that I've been part of amazing teams such as{' '}
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
          (prev. Credijusto) and <a href="https://ibm.com">IBM</a>. And since I
          cannot sit still, I've done some extra work with with some clients
          like{' '}
          <a {...blankProps} href="https://fucesa.com">
            Fucesa
          </a>
          ,{' '}
          <a {...blankProps} href="https://concepthaus.mx/">
            ConceptHaus
          </a>
          .
        </p>
      </Content>
    </Template>
  )
}

export default Index
