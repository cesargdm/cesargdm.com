import { vars } from '@/styles/theme.css'

import { style } from '@vanilla-extract/css'

const LIGHT_SQUARE = '#E4E8EF'
const DARK_SQUARE = '#9AA7BA'

export const container = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: vars.space.large,
	margin: `${vars.space.xxlarge} 0`,
})

export const status = style({
	fontWeight: vars.fontWeight.medium,
	textAlign: 'center',
	margin: 0,
})

export const error = style({
	color: vars.colors.text.secondary,
	fontWeight: vars.fontWeight.regular,
})

export const board = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(8, 1fr)',
	// Caps the board on desktop while letting it shrink on a phone, where the
	// viewport is narrower than the padding-adjusted max.
	width: 'min(100%, 420px)',
	aspectRatio: '1',
	borderRadius: vars.borderRadius.medium,
	overflow: 'hidden',
	boxShadow: vars.boxShadow.medium,
})

export const square = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	// The glyphs are the only thing in the cell, so sizing them off the cell
	// keeps the board legible at every width without a media query.
	fontSize: 'min(7vw, 32px)',
	lineHeight: 1,
	border: 'none',
	padding: 0,
	cursor: 'pointer',
	// The global stylesheet rounds every button to a pill and floors it at 40px.
	// Squares on a chess board are square, and the grid must be free to shrink
	// below that floor on a narrow phone.
	borderRadius: 0,
	minWidth: 0,
	minHeight: 0,
	// The board keeps its own palette in both themes. Routing it through the
	// theme tokens made the dark squares #111318 and the light ones #1A202C in
	// dark mode — two near-blacks, with the pieces invisible on both. A chess
	// board reads as a chess board or it reads as nothing.
	backgroundColor: DARK_SQUARE,
	// White pieces are outline glyphs and black pieces are filled, so a single
	// dark ink distinguishes them on either square shade.
	color: '#111318',
	transition: 'background-color 150ms',
	':focus-visible': {
		outline: `2px solid ${vars.colors.primary}`,
		outlineOffset: '-2px',
	},
})

export const light = style({
	backgroundColor: LIGHT_SQUARE,
})

export const selected = style({
	backgroundColor: vars.colors.primary,
})

export const target = style({
	cursor: 'pointer',
})

export const newGame = style({
	minHeight: vars.sizes.button,
	padding: `0 ${vars.space.xlarge}`,
	borderRadius: vars.borderRadius.full,
	border: `1px solid ${vars.colors.border}`,
	backgroundColor: vars.colors.background.content,
	color: vars.colors.text.regular,
	fontWeight: vars.fontWeight.medium,
	cursor: 'pointer',
	':hover': {
		backgroundColor: vars.colors.background.gray,
	},
})

export const footnote = style({
	fontSize: vars.fontSize.small,
	color: vars.colors.text.secondary,
	textAlign: 'center',
	maxWidth: '52ch',
	margin: 0,
})
