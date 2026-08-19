import { cardButton } from '@/modules/card.css'

import { vars } from '@/styles/theme.css'

import { style } from '@vanilla-extract/css'

export const profileButton = style([
	cardButton,
	{
		color: 'white',
		boxShadow: 'none',
		backgroundColor: '#1185fe',
		':hover': {
			boxShadow: 'none',
			backgroundColor: '#0d6efd',
		},
	},
])

export const postParagraph = style({
	fontSize: vars.fontSize.xlarge,
	padding: `${vars.space.large} 0`,
	margin: 'auto',
	textAlign: 'center',
})

export const bioParagraph = style({
	whiteSpace: 'pre-line',
	textAlign: 'center',
	margin: 'auto',
	padding: `${vars.space.large} 0`,
})
