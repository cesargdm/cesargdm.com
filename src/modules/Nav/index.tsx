import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import {
	IconArticle,
	IconCurrencyEthereum,
	IconTrophy,
} from '@tabler/icons-react'

import small from './cesargdm-small.svg'

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
	border-bottom: 2px solid var(--colors-border);
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
			display: flex;
			gap: 6px;
			opacity: 0.7;
			transition: opacity 0.2s ease-in-out;

			&.active {
				opacity: 1;
			}

			&::before {
				position: absolute;
				transform: translateY(6px);
				bottom: 0;
				content: '';
				width: 100%;
				height: 2px;
				background-color: var(--colors--text);
				opacity: 0;
			}

			&:hover {
				opacity: 1;
				::before {
					opacity: 0.2;
				}
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
				<Link to="/">
					<img
						style={{ marginRight: 5 }}
						width={30}
						height={30}
						src={small}
						alt=""
					/>
					cesargdm
				</Link>
				<ul>
					<li>
						<Link partiallyActive activeClassName="active" to="/projects/">
							<IconTrophy size={18} />
							Projects
						</Link>
					</li>
					<li>
						<Link partiallyActive activeClassName="active" to="/blog/">
							<IconArticle size={18} />
							Blog
						</Link>
					</li>
					<li>
						<Link partiallyActive activeClassName="active" to="/eth/">
							<IconCurrencyEthereum size={18} />
							.eth
						</Link>
					</li>
				</ul>
			</Content>
		</Container>
	)
}

export default Nav
