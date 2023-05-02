import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const container = style({
	display: 'flex',
	justifyContent: 'space-between',
	maxWidth: 1200,
	padding: vars.space.medium,
})

export const list = style({
	display: 'grid',
	gridAutoFlow: 'column',
})
