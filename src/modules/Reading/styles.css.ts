import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const bookList = style({
	gap: vars.space.small,
	width: '100%',
	display: 'grid',
	overflowX: 'auto',
	gridAutoFlow: 'column',
	gridAutoColumns: '60%',
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
})
