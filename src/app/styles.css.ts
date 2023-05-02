import { style } from '@vanilla-extract/css'
import { vars } from './theme.css'

export const content = style({
	maxWidth: 1200,
	padding: 20,
	margin: '0 auto',
})

export const card = style({
	backgroundColor: '#f6f6f6',
	padding: vars.space.medium,
	borderRadius: vars.space.medium,
})

export const cards = style({
	display: 'grid',
	gap: vars.space.medium,
	gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
})

export const chat = style({
	gridColumnEnd: 'span 2',
})
