import { vars } from '@/app/theme.css'

import { style } from '@vanilla-extract/css'

export const entriesList = style({
	display: 'grid',
	gridTemplateColumns: '1fr',
	margin: `${vars.space.large} 0`,
	gap: vars.space.medium,
	'@media': {
		'(min-width: 768px)': {
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
		'(min-width: 1024px)': {
			gridTemplateColumns: 'repeat(3, 1fr)',
		},
	},
})

export const pageDescription = style({
	margin: `${vars.space.medium} 0 ${vars.space.large}`,
})

export const entryItem = style({
	position: 'relative',
})

export const projectDescription = style({
	width: '100%',
})

export const projectTechnologies = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.medium,
})

export const projectTechnologyItem = style({
	backgroundColor: 'rgba(0, 0, 0, 0.075)',
	padding: `${vars.space.small} ${vars.space.medium}`,
	borderRadius: vars.borderRadius.large,
	fontSize: vars.fontSize.xsmall,
})

export const entryLink = style({
	padding: vars.space.xlarge,
	display: 'flex',
	height: '100%',
	flexDirection: 'column',
	backgroundColor: vars.colors.background.content,
	borderRadius: vars.borderRadius.xlarge,
	gap: vars.space.medium,
	':hover': {
		textDecoration: 'none',
	},
})

export const highlightedEntryItem = style([
	entryItem,
	{
		gridColumn: 'inherit',
		gridRow: 'inherit',
		'@media': {
			'(min-width: 768px)': {
				gridColumn: 'span 2',
				gridRow: 'span 2',
			},
		},
	},
])

export const projectEntryLink = style([
	entryLink,
	{
		gap: vars.space.xlarge,
		transition: '300ms',
		transform: 'scale(1)',
		opacity: 1,
		flexDirection: 'row',
		alignItems: 'center',
		':focus': {
			transform: 'scale(0.98)',
			opacity: 0.9,
		},
		':hover': {
			transform: 'scale(0.98)',
			opacity: 0.9,
			textDecoration: 'none',
		},
		':active': {
			transform: 'scale(1)',
		},
	},
])

export const entryTitle = style({
	fontSize: vars.fontSize.xlarge,
	fontWeight: 'bold',
})

export const entryText = style({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.medium,
})

export const entryDescriptionContainer = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
})

export const entryDate = style({
	fontSize: vars.fontSize.small,
	opacity: 0.8,
})
