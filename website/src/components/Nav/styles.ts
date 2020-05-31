import styled from 'styled-components'

import me from '../../assets/me.svg'

const Container = styled.div`
  box-shadow: 0 0 16px var(--color--shadow);
  position: fixed;
  top: 0;
  width: 100%;
  background-color: var(--color--background);
  height: 48px;
  z-index: 1;
  overflow: hidden;
`

const Content = styled.nav`
  max-width: var(--max-width--content);
  margin: 0 auto;
  padding: 0 16px;
  height: 100%;
  font-family: Inter;
  font-weight: 800;

  @supports (padding: max(0px)) {
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
  }

  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    li {
      min-width: 100px;
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`

const MeIcon = styled.div`
  background: no-repeat url(${me}) center top;
  background-size: 100px;
  width: 60px;
  height: 40px;
`

export { Container, Content, MeIcon }
