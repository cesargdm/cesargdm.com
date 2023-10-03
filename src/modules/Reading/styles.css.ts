import { vars } from '@/app/theme.css'

import { style } from '@vanilla-extract/css'

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
	boxShadow: vars.boxShadow.medium,
	borderRadius: `0 ${vars.borderRadius.medium} ${vars.borderRadius.medium} 0`,
})

export const titleText = style({
	fontWeight: 'bold',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	lineClamp: 1,
	WebkitLineClamp: 1,
	display: '-webkit-box',
	WebkitBoxOrient: 'vertical',
})
