import styled from 'styled-components'

const Container = styled.div`
  border-bottom: 1px solid var(--color--light-background);
  position: fixed;
  top: 0;
  width: 100%;
  background-color: var(--color--background);
  height: 48px;
  z-index: 1;
`

const Content = styled.nav`
  max-width: var(--max-width--content);
  margin: 0 auto;
  padding: 16px;
  font-family: Inter;
  font-weight: 800;

  @supports (padding: max(0px)) {
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
  }

  ul {
    display: flex;
    justify-content: space-between;
    li {
      margin-right: 16px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`

export { Container, Content }
