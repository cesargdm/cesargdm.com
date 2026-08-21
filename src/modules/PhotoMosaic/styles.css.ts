import { style } from '@vanilla-extract/css'

import { press } from '@/styles/press.css'
import { vars } from '@/styles/theme.css'

/**
 * `global.css` gives every `input` `appearance: none`, a 40px minimum box and a
 * pill radius. On a range or a checkbox that does not merely restyle the
 * control — it deletes its track and thumb outright in WebKit and Chromium — so
 * each one has to opt back in explicitly.
 */
const nativeControl = {
	// Unprefixed only: `appearance` has been supported since Safari 15.4, below
	// this tool's 16.4 floor, and csstype has no 'auto' for the -webkit- form.
	appearance: 'auto',
	accentColor: vars.colors.primary,
	minWidth: 0,
	minHeight: 'auto',
	borderRadius: 0,
} as const

export const container = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.xlarge,
	margin: `${vars.space.xlarge} 0`,
	// The island is client:only, so nothing renders server-side. Holding the box
	// open keeps hydration from shoving the rest of the page down.
	minHeight: 480,
})

export const panel = style({
	display: 'grid',
	gap: vars.space.xlarge,
	gridTemplateColumns: '1fr',
	'@media': {
		'screen and (min-width: 768px)': {
			gridTemplateColumns: '20rem 1fr',
			alignItems: 'start',
		},
	},
})

export const controls = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.large,
})

export const group = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.small,
})

export const groupHeading = style({
	margin: 0,
	fontSize: vars.fontSize.medium,
	fontWeight: vars.fontWeight.medium,
})

export const label = style({
	fontSize: vars.fontSize.small,
	fontWeight: vars.fontWeight.medium,
	color: vars.colors.text.regular,
})

export const hint = style({
	margin: 0,
	fontSize: vars.fontSize.xsmall,
	color: vars.colors.text.secondary,
})

export const value = style({
	fontSize: vars.fontSize.xsmall,
	color: vars.colors.text.secondary,
	fontVariantNumeric: 'tabular-nums',
})

export const slider = style({
	...nativeControl,
	width: '100%',
})

export const checkboxRow = style({
	display: 'flex',
	alignItems: 'center',
	gap: vars.space.medium,
})

export const checkbox = style({
	...nativeControl,
	width: '1rem',
	height: '1rem',
	flexShrink: 0,
})

export const fileInput = style({
	fontSize: vars.fontSize.small,
	minHeight: 'auto',
	borderRadius: 0,
	textAlign: 'left',
})

/**
 * Clipped rather than `display: none`: a hidden-by-display input cannot be
 * focused, which would leave the drop zone keyboard-unreachable.
 */
export const visuallyHidden = style({
	position: 'absolute',
	width: 1,
	height: 1,
	padding: 0,
	margin: -1,
	overflow: 'hidden',
	clipPath: 'inset(50%)',
	whiteSpace: 'nowrap',
	border: 0,
})

export const dropZone = style([
	press,
	{
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: vars.space.small,
		padding: vars.space.xlarge,
		textAlign: 'center',
		cursor: 'pointer',
		border: `1px dashed ${vars.colors.border}`,
		borderRadius: vars.borderRadius.medium,
		backgroundColor: vars.colors.background.content,
		color: vars.colors.text.secondary,
		fontSize: vars.fontSize.small,
		selectors: {
			'&:focus-within': {
				outline: `2px solid ${vars.colors.primary}`,
				outlineOffset: 2,
			},
		},
	},
])

export const dropZoneActive = style({
	borderStyle: 'solid',
	borderColor: vars.colors.primary,
	backgroundColor: vars.colors.background.gray,
})

export const preview = style({
	display: 'flex',
	flexDirection: 'column',
	gap: vars.space.medium,
	minWidth: 0,
})

export const canvasFrame = style({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minHeight: 320,
	padding: vars.space.medium,
	borderRadius: vars.borderRadius.medium,
	border: `1px solid ${vars.colors.border}`,
	backgroundColor: vars.colors.background.gray,
	color: vars.colors.text.tertiary,
	fontSize: vars.fontSize.small,
	overflow: 'hidden',
})

export const canvas = style({
	maxWidth: '100%',
	maxHeight: '70vh',
	objectFit: 'contain',
	borderRadius: vars.borderRadius.medium,
})

export const actions = style({
	display: 'flex',
	flexWrap: 'wrap',
	gap: vars.space.medium,
	alignItems: 'center',
})

const actionBase = {
	minHeight: vars.sizes.button,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: `0 ${vars.space.xlarge}`,
	borderRadius: vars.borderRadius.full,
	// Deliberately not white-on-primary: #3B82F6 against white is about 3.7:1,
	// short of the 4.5:1 that body-sized text needs.
	border: `1px solid ${vars.colors.border}`,
	backgroundColor: vars.colors.background.content,
	color: vars.colors.text.regular,
	fontSize: vars.fontSize.small,
	fontWeight: vars.fontWeight.medium,
	cursor: 'pointer',
} as const

export const button = style([
	press,
	{
		...actionBase,
		':hover': {
			textDecoration: 'none',
			backgroundColor: vars.colors.background.gray,
		},
		':disabled': { opacity: 0.5, cursor: 'not-allowed' },
	},
])

export const downloadLink = style([
	press,
	{
		...actionBase,
		':hover': {
			textDecoration: 'none',
			backgroundColor: vars.colors.background.gray,
		},
	},
])

export const downloadDisabled = style({
	opacity: 0.5,
	pointerEvents: 'none',
})

export const progressBar = style({
	width: '100%',
	height: vars.space.small,
	// Unprefixed only: `appearance` has been supported since Safari 15.4, below
	// this tool's 16.4 floor, and csstype has no 'auto' for the -webkit- form.
	appearance: 'auto',
	accentColor: vars.colors.primary,
})

export const status = style({
	margin: 0,
	fontSize: vars.fontSize.xsmall,
	color: vars.colors.text.secondary,
	minHeight: '1.2em',
})

export const notice = style({
	margin: 0,
	fontSize: vars.fontSize.xsmall,
	color: vars.colors.text.secondary,
})

export const error = style({
	margin: 0,
	fontSize: vars.fontSize.small,
	color: vars.colors.primary,
	fontWeight: vars.fontWeight.medium,
})
