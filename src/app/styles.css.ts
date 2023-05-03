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

export const dropdownText = style({
	// bottom line
	textDecorationLine: 'underline',
	textDecorationStyle: 'dotted',
	textDecorationColor: vars.colors.primary,
	minHeight: 'auto',
	minWidth: 'auto',
	lineHeight: 1.5,
	fontSize: vars.fontSize.large,
	display: 'inline',
})

export const card = style({
	height: '100%',
	overflow: 'hidden',
	position: 'relative',
	display: 'flex',
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
	gap: vars.space.medium,
	gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
})

export const chat = style({
	gridColumnEnd: 'span 2',
})

export const introParagraph = style({
	lineHeight: 1.5,
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
