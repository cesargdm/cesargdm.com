import styled from 'styled-components'

const EntryContent = styled.div`
  margin-bottom: 40px;

  img {
    width: auto;
    max-height: 50vh;
    margin: 0 auto;
    display: block;
  }

  blockquote {
    background-color: var(--colors--background-secondary);
    padding: 8px 16px;
    border-radius: 16px;
    margin-bottom: 16px;
    font-weight: 600;
    opacity: 0.8;
    font-size: 0.9rem;

    p {
      margin: 0;
      padding-left: 8px;
      border-left: 2px solid var(--colors--tint);
    }
  }

  ul {
    margin: 8px 0;
    list-style: square;

    li {
      margin-bottom: 8px;
      margin-left: 16px;
    }
  }
`

export default EntryContent
