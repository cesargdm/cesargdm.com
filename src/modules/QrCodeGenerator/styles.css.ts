import { vars } from '@/styles/theme.css'

import { style } from '@vanilla-extract/css'

export const container = style({
	display: 'grid',
	gap: vars.space.xlarge,
	gridTemplateColumns: '1fr',
	margin: `${vars.space.xlarge} 0`,
	'@media': {
		'screen and (min-width: 768px)': {
			gridTemplateColumns: '1fr auto',
			alignItems: 'start',
		},
	},
})

export const controls = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.large,
})

export const field = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.medium,
})

export const textarea = style({
	width: '100%',
	resize: 'vertical',
})

export const select = style({
	width: '100%',
})

export const preview = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: vars.space.large,
	minHeight: 260,
})

export const previewFrame = style({
	width: 240,
	// The generated SVG carries no colour of its own beyond black on white, so
	// it needs a white plate in dark mode to stay scannable.
	padding: vars.space.large,
	borderRadius: vars.borderRadius.medium,
	backgroundColor: '#FFFFFF',
	boxShadow: vars.boxShadow.medium,
})

export const actions = style({
	display: 'flex',
	gap: vars.space.medium,
	flexWrap: 'wrap',
	justifyContent: 'center',
})

export const download = style({
	minHeight: vars.sizes.button,
	display: 'flex',
	alignItems: 'center',
	padding: `0 ${vars.space.xlarge}`,
	borderRadius: vars.borderRadius.full,
	// Deliberately not white-on-primary: #3B82F6 against white is about 3.7:1,
	// short of the 4.5:1 needed for body-sized text.
	border: `1px solid ${vars.colors.border}`,
	backgroundColor: vars.colors.background.content,
	color: vars.colors.text.regular,
	fontWeight: vars.fontWeight.medium,
	':hover': {
		textDecoration: 'none',
		backgroundColor: vars.colors.background.gray,
	},
})

export const errorText = style({
	color: vars.colors.text.secondary,
	textAlign: 'center',
	maxWidth: '32ch',
	margin: 0,
})
