import { vars } from './theme.css'
import { style } from '@vanilla-extract/css'

export const content = style({
	margin: '0 auto',
	padding: vars.space.large,
	maxWidth: vars.sizes.maxWidthPage,
	paddingTop: `calc(${vars.sizes.navBar} + ${vars.space.xxlarge})`,
})

export const errorPageContainer = style({
	display: 'flex',
	alignItems: 'center',
	flexDirection: 'column',
	justifyContent: 'center',
	gap: vars.space.xlarge,
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
	display: 'flex',
	overflow: 'hidden',
	position: 'relative',
	flexDirection: 'column',
	padding: vars.space.large,
	borderRadius: vars.borderRadius.xlarge,
	backgroundColor: vars.colors.background.content,
})

export const cardsList = style({
	display: 'grid',
	gap: vars.space.large,
	gridTemplateColumns: '1fr',
	alignItems: 'flex-start',
	'@media': {
		'(min-width: 768px)': {
			gridTemplateColumns: 'repeat(3, 1fr)',
		},
		'(min-width: 1024px)': {
			gridTemplateColumns: 'repeat(4, 1fr)',
		},
	},
})

export const twoColumnCard = style({
	'@media': {
		'(min-width: 768px)': {
			gridColumn: 'span 2',
		},
	},
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
