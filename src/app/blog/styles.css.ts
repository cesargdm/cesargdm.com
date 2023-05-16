import { style } from '@vanilla-extract/css'
import { vars } from '../theme.css'

export const entriesList = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	// gap: vars.space.large,
	margin: `${vars.space.large} 0`,
	'@media': {
		'(min-width: 768px)': {
			gridTemplateColumns: '1fr 1fr',
		},
	},
})

export const entryItem = style({ padding: vars.space.large })

export const highlightedEntry = style([
	entryItem,
	{
		backgroundColor: vars.colors.background.content,
		borderRadius: vars.borderRadius.large,
	},
])

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
