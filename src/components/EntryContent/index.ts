import styled from '@emotion/styled'

const EntryContent = styled.div`
	margin-bottom: 40px;

	img {
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
	}

	blockquote {
		background-color: var(--colors--background-secondary);
		padding: var(--spaces--medium) var(--spaces--large);
		border-radius: var(--border_radius--medium);
		font-weight: 600;
		opacity: 0.8;
		font-size: 0.9rem;
		max-width: 600px;
		margin: 0 auto 24px;

		p {
			margin: 0;
			padding-left: var(--spaces--medium);
			border-left: 2px solid var(--colors--tint);
		}
	}

	ul {
		margin: var(--spaces--medium) 0;
		list-style: square;

		li {
			margin-bottom: var(--spaces--medium);
			margin-left: var(--spaces--large);
		}
	}
`

export default EntryContent
