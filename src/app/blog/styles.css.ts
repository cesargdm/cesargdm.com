import { style } from '@vanilla-extract/css'
import { vars } from '../theme.css'

export const entriesList = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.large,
	margin: `${vars.space.large} 0`,
})

export const entryItem = style({})

export const entryLink = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.small,
	':hover': {
		textDecoration: 'none',
	},
})

export const entryTitle = style({
	fontSize: vars.fontSize.xlarge,
	fontWeight: 'bold',
})

export const entryDate = style({
	fontSize: vars.fontSize.small,
	color: vars.colors.text.secondary,
})
