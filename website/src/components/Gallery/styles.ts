import styled from 'styled-components'

const Hero = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  transition: 0.5s;
  box-shadow: 0 4px 24px var(--color--shadow);

  &:hover {
    transform: scale(0.975);
  }
  &:active {
    transform: scale(1);
  }

  .gatsby-image-wrapper {
    width: 100% !important;
    height: 100% !important;
  }

  h6 {
    position: absolute;
    color: white;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 16px;
    font-size: 4rem;
    font-weight: 900;
  }
`

export { Hero }
