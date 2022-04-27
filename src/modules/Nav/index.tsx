import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

const Container = styled.nav`
  height: var(--sizes--nav_height);
  display: flex;
  align-items: center;
  padding: 0 10px;
`

const Content = styled.div`
  max-width: var(--sizes--content_max_width);
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #eee;
  height: 100%;

  a {
    text-decoration: none;
    color: inherit;
    font-weight: 700;
    position: relative;
  }

  ul {
    display: flex;
    flex-direction: row;
    gap: 15px;

    a {
      &::before {
        position: absolute;
        transform: translateY(6px);
        bottom: 0;
        content: '';
        width: 100%;
        height: 2px;
        background-color: black;
        opacity: 0;
      }
      &:hover::before {
        opacity: 0.2;
      }
      &.active::before {
        opacity: 1;
      }
    }
  }
`

function Nav() {
  return (
    <Container>
      <Content>
        <Link to="/">cesargdm</Link>
        <ul>
          {/* <li>
            <Link partiallyActive activeClassName="active" to="/projects">
              Projects
            </Link>
          </li> */}
          <li>
            <Link partiallyActive activeClassName="active" to="/blog">
              Blog
            </Link>
          </li>
          <li>
            <Link partiallyActive activeClassName="active" to="/eth">
              .eth
            </Link>
          </li>
        </ul>
      </Content>
    </Container>
  )
}

export default Nav
