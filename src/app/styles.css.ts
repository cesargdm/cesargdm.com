import { style } from '@vanilla-extract/css'
import { vars } from './theme.css'

export const content = style({
	maxWidth: 1200,
	padding: 20,
	margin: '0 auto',
})

export const body = style({
	color: vars.colors.text.regular,
	backgroundColor: vars.colors.background.regular,
})

export const card = style({
	backgroundColor: vars.colors.background.content,
	padding: vars.space.large,
	borderRadius: vars.space.large,
	height: '100%',
})

export const cards = style({
	display: 'grid',
	gap: vars.space.medium,
	gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
})

export const chat = style({
	gridColumnEnd: 'span 2',
})
