import { cardButton } from '@/modules/card.css'

import { vars } from '@/styles/theme.css'

import { style, styleVariants } from '@vanilla-extract/css'

export const totalText = style({
	margin: 0,
	color: vars.colors.text.secondary,
	fontSize: vars.fontSize.small,
})

export const gridContainer = style({
	overflowX: 'auto',
	padding: `${vars.space.medium} 0`,
})

export const grid = style({
	display: 'grid',
	gap: '3px',
	width: 'fit-content',
	gridAutoFlow: 'column',
	gridAutoColumns: '10px',
	gridTemplateRows: 'repeat(7, 1fr)',
})

export const cell = style({
	width: '10px',
	height: '10px',
	borderRadius: '2px',
})

export const cellLevels = styleVariants({
	0: { backgroundColor: vars.colors.background.gray },
	1: { backgroundColor: vars.colors.primary, opacity: 0.25 },
	2: { backgroundColor: vars.colors.primary, opacity: 0.5 },
	3: { backgroundColor: vars.colors.primary, opacity: 0.75 },
	4: { backgroundColor: vars.colors.primary, opacity: 1 },
})

export const githubButton = style([
	cardButton,
	{
		color: 'white',
		boxShadow: 'none',
		backgroundColor: '#24292f',
		':hover': {
			boxShadow: 'none',
			backgroundColor: '#171515',
		},
	},
])
