import styled from 'styled-components'

const Container = styled.div`
  padding-top: 48px;
  min-height: 100vh;
  position: relative;
  padding-bottom: 78px;
`

const Content = styled.div`
  max-width: var(--max-width--content);
  margin: 0 auto;
  padding: 40px 16px;

  @supports (padding: max(0px)) {
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
  }
`

export { Container, Content }
