import { vars } from '../theme.css'
import { style } from '@vanilla-extract/css'

export const entriesList = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	margin: `${vars.space.large} 0`,
	gap: vars.space.large,
	'@media': {
		'(min-width: 768px)': {
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
		'(min-width: 1024px)': {
			gridTemplateColumns: 'repeat(3, 1fr)',
		},
	},
})

export const entryItem = style({
	backgroundColor: vars.colors.background.content,
	borderRadius: vars.borderRadius.large,
	transition: 'opacity 300ms',
	':hover': {
		opacity: 0.8,
	},
})

export const highlightedEntry = style([
	entryItem,
	{
		gridColumn: 'span 2',
		gridRow: 'span 2',
	},
])

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
		flexDirection: 'column',
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
