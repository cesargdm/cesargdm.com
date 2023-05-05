import { style } from '@vanilla-extract/css'

import { vars } from './theme.css'

export const content = style({
	padding: 20,
	margin: '0 auto',
	maxWidth: vars.sizes.maxWidthPage,
	paddingTop: `calc(${vars.sizes.navBar} + ${vars.space.medium})`,
})

export const body = style({
	color: vars.colors.text.regular,
	backgroundColor: vars.colors.background.regular,
})

export const dropdownText = style({
	minWidth: 'auto',
	lineHeight: 1.5,
	display: 'inline',
	minHeight: 'auto',
	fontSize: vars.fontSize.large,
	textDecorationStyle: 'dotted',
	textDecorationLine: 'underline',
	textDecorationColor: vars.colors.primary,
})

export const card = style({
	height: '100%',
	minHeight: 150,
	display: 'flex',
	overflow: 'hidden',
	position: 'relative',
	flexDirection: 'column',
	padding: vars.space.large,
	borderRadius: vars.borderRadius.xlarge,
	backgroundColor: vars.colors.background.content,
})

export const cretiaCard = style([
	card,
	{
		color: vars.colors.text.secondary,
		':hover': {
			color: vars.colors.text.regular,
		},
		':focus': {
			color: vars.colors.text.regular,
		},
	},
])

export const cards = style({
	display: 'grid',
	gap: vars.space.large,
	gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
})

export const chat = style({
	gridColumnEnd: 'span 2',
})

export const introParagraph = style({
	lineHeight: 1.5,
	marginTop: vars.space.medium,
	fontSize: vars.fontSize.large,
})

export const introContainer = style({
	maxWidth: 800,
	margin: '0 auto',
	minHeight: '80dvh',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	paddingBottom: vars.sizes.navBar,
})
