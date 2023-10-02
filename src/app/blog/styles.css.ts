import { createVar, keyframes, style } from '@vanilla-extract/css'
import { vars } from '../theme.css'

export const entriesList = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	margin: `${vars.space.large} 0`,
	'@media': {
		'(min-width: 768px)': {
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
		'(min-width: 1024px)': {
			gridTemplateColumns: 'repeat(3, 1fr)',
		},
	},
})

export const entryItem = style({})

export const highlightedEntry = style([entryItem])

export const entryLink = style({
	display: 'flex',
	flexDirection: 'column',
	padding: vars.space.large,
	gap: vars.space.small,
	borderRadius: vars.borderRadius.large,
	':hover': {
		textDecoration: 'none',
	},
})

export const projectEntryLink = style([
	entryLink,
	{
		flexDirection: 'row',
		gap: vars.space.large,
		alignItems: 'center',
	},
])

export const entryTitle = style({
	fontSize: vars.fontSize.xlarge,
	fontWeight: 'bold',
})

export const entryDate = style({
	fontSize: vars.fontSize.small,
	opacity: 0.8,
	fontWeight: 'bold',
})
