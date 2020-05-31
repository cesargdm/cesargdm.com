import styled from 'styled-components'

const Container = styled.footer`
  padding: 16px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  bottom: -112px;
  width: 100%;
  height: 112px;
  font-size: 0.9rem;

  ul {
    display: flex;
    justify-content: center;
    font-weight: 500;
    li {
      margin-right: 8px;
    }
  }

  p {
    text-align: center;
    font-size: 0.9rem;
  }

  @supports (padding: max(0px)) {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
`

export { Container }
