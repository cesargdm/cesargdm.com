import { style } from '@vanilla-extract/css'

import { vars } from '@/app/theme.css'

export const bookList = style({
	width: '100%',
	display: 'grid',
	overflowX: 'auto',
	gridAutoFlow: 'column',
	gridAutoColumns: '66.6%',
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
	alignItems: 'center',
	flexDirection: 'column',
	cursor: 'pointer',
	':hover': {
		textDecoration: 'none',
	},
})

export const bookItem = style({
	scrollSnapAlign: 'start',
	height: '100%',
	padding: vars.space.large,
})

export const bookImage = style({
	marginTop: 'auto',
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
