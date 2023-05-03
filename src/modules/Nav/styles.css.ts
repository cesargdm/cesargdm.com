import { vars } from '@/app/theme.css'
import { style } from '@vanilla-extract/css'

export const container = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	maxWidth: 1200,
	margin: '0 auto',
	padding: vars.space.medium,
	height: vars.sizes.navBar,
})

export const list = style({
	display: 'grid',
	gridAutoFlow: 'column',
	gap: vars.space.large,
})
