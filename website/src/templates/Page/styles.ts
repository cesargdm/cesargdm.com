import styled from 'styled-components'

import { Content as DefaultContent } from '../../layouts/Default/styles'

const Content = styled(DefaultContent)`
  a {
    text-decoration: underline;
    text-decoration-color: var(--color--tint);
  }
`

const MeContainer = styled.div`
  width: 100%;
  padding: 0 24px 24px;
  margin: 0 auto;
  display: grid;

  align-items: flex-end;
  gap: 16px;
  justify-content: center;

  img {
    object-fit: cover;
    overflow: hidden;
    width: 100%;
    object-position: 50% 0;
  }

  @media (min-width: 500px) {
    grid-template-columns: 100px 265px;
  }
`

export { MeContainer, Content }
