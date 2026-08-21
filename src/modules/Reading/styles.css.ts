import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const bookList = style({
	width: '100%',
	display: 'grid',
	overflowX: 'auto',
	// overflowY: 'hidden',
	gridAutoRows: '1fr',
	gridAutoFlow: 'column',
	gridAutoColumns: '40%',
	scrollSnapType: 'x mandatory',
	'::-webkit-scrollbar': {
		display: 'none',
		width: 0,
		background: 'transparent',
	},
})

export const bookAnchor = style({
	display: 'flex',
	height: '100%',
	cursor: 'pointer',
	alignItems: 'center',
	flexDirection: 'column',
	':hover': {
		textDecoration: 'none',
	},
})

export const bookItem = style({
	height: '100%',
	scrollSnapAlign: 'start',
	padding: vars.space.large,
})

export const bookImage = style({
	marginTop: 'auto',
	maxHeight: '30vh',
	// Covers come back at assorted sizes. Reserving a fixed ratio keeps CLS at
	// zero without asserting intrinsic dimensions the image does not have.
	width: '98px',
	height: 'auto',
	aspectRatio: '2 / 3',
	objectFit: 'cover',
	boxShadow: vars.boxShadow.medium,
	borderRadius: `0 ${vars.borderRadius.medium} ${vars.borderRadius.medium} 0`,
})

export const titleText = style({
	fontWeight: vars.fontWeight.bold,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	lineClamp: 1,
	WebkitLineClamp: 1,
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
})
