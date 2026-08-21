import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

export const entriesList = style({
	display: 'grid',
	// auto-fill + minmax replaces the fixed 1/2/3 breakpoints: columns are added
	// whenever there is room for one, so the grid adapts to any width instead of
	// jumping at two arbitrary points.
	gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 17rem), 1fr))',
	// Wide cards leave holes in the row they start on. `dense` backfills those
	// with the next card that fits, which is what stops the layout looking
	// ragged. It can pull a later card forward visually; DOM and tab order are
	// unchanged, and the list is a gallery rather than a sequence.
	gridAutoFlow: 'dense',
	gridAutoRows: 'minmax(11rem, auto)',
	margin: `${vars.space.large} 0`,
	gap: vars.space.medium,
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
		// Only widen once two columns can actually exist — below that the span
		// would overflow the single-column grid.
		'@media': {
			'(min-width: 37rem)': {
				gridColumn: 'span 2',
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
	fontSize: vars.fontSize.large,
	fontWeight: vars.fontWeight.bold,
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
