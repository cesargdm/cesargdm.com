import { globalStyle, style } from '@vanilla-extract/css'

import { textInput } from '@/components/TextInput/styles.css'
import { glass } from '@/styles/glass.css'
import { vars } from '@/styles/theme.css'

export const atlas = style({
	vars: {
		'--leaf': vars.colors.primary,
		'--clay': vars.colors.primary,
		'--atlas-surface': vars.colors.background.regular,
	},
	color: vars.colors.text.regular,
	display: 'grid',
	gap: 20,
	position: 'relative',
	selectors: {
		'&[data-expanded="true"]': {
			position: 'fixed',
			inset: 0,
			zIndex: 1100,
			overflow: 'auto',
			padding: 'max(16px, env(safe-area-inset-top)) 20px',
			background: vars.colors.background.regular,
		},
	},
})
export const hero = style({
	padding: '12px 0 10px',
	display: 'grid',
	gap: 12,
	maxWidth: 1400,
})
export const eyebrow = style({
	textTransform: 'uppercase',
	letterSpacing: '0.18em',
	fontSize: 12,
	fontWeight: 600,
	color: vars.colors.text.secondary,
})
export const title = style({
	fontFamily: vars.font.heading,
	fontWeight: vars.fontWeight.bold,
	fontSize: vars.fontSize.xlarge,
	lineHeight: 1.05,
	margin: 0,
	letterSpacing: '-0.02em',
})
export const subtitle = style({
	fontSize: 'clamp(1rem, 1.3vw, 1.3rem)',
	color: vars.colors.text.secondary,
	lineHeight: 1.6,
	maxWidth: 1100,
	margin: 0,
})
export const toolbar = style({
	display: 'flex',
	gap: 8,
	alignItems: 'center',
	flexWrap: 'wrap',
})
export const search = style([
	textInput,
	{ flex: '1 1 220px', minWidth: 0, minHeight: 44 },
])
export const button = style([
	glass,
	{
		minHeight: 44,
		minWidth: 44,
		padding: '8px 14px',
		borderRadius: vars.borderRadius.full,
		border: 'none',
		color: 'inherit',
		font: 'inherit',
		cursor: 'pointer',
		textDecoration: 'none',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
		selectors: {
			'&[aria-pressed="true"]': {
				background: 'var(--leaf)',
				color: '#fff',
			},
		},
	},
])
export const workspace = style({
	display: 'grid',
	gap: 16,
	gridTemplateColumns: 'minmax(0, 1fr)',
	alignItems: 'start',
	'@media': {
		'(min-width: 1200px)': {
			gridTemplateColumns: '210px minmax(0, 1fr)',
			selectors: {
				'&[data-profile="true"]': {
					gridTemplateColumns: '210px minmax(0, 1fr) 290px',
				},
			},
		},
		'(min-width: 2000px)': {
			gridTemplateColumns: '260px minmax(0, 1fr)',
			selectors: {
				'&[data-profile="true"]': {
					gridTemplateColumns: '260px minmax(0, 1fr) 380px',
				},
			},
			fontSize: '1.15rem',
		},
	},
})
export const panel = style({
	padding: 20,
	borderRadius: vars.borderRadius.large,
	background: vars.colors.background.content,
	minWidth: 0,
	display: 'grid',
	gap: 16,
})
export const filters = style([
	panel,
	{
		'@media': {
			'(max-width: 1199px)': {
				display: 'none',
				selectors: {
					'&[data-open="true"]': {
						display: 'grid',
						position: 'fixed',
						inset: '10% 16px 16px',
						zIndex: 1200,
						overflow: 'auto',
						boxShadow: '0 0 0 100vmax #0008',
					},
				},
			},
		},
	},
])
export const mobileToggle = style({
	'@media': { '(min-width: 1200px)': { display: 'none' } },
})
export const filterGroup = style({
	display: 'grid',
	gap: 4,
	border: 0,
	padding: 0,
	margin: 0,
})
export const check = style({
	display: 'flex',
	alignItems: 'center',
	gap: 8,
	minHeight: 44,
	fontSize: '0.875em',
	cursor: 'pointer',
})
export const stage = style({
	position: 'relative',
	minWidth: 0,
	overflow: 'hidden',
	borderRadius: vars.borderRadius.large,
	background: vars.colors.background.content,
})
export const canvas = style({
	display: 'block',
	width: '100%',
	height: 'min(68svh, 760px)',
	minHeight: 420,
	touchAction: 'pan-y',
	selectors: {
		'&[data-expanded="true"]': { touchAction: 'none', height: '80svh' },
	},
	'@media': {
		'(pointer: fine)': { touchAction: 'none' },
		'(min-width: 2000px)': { height: '72svh', minHeight: 700 },
	},
})
export const controls = style({
	position: 'absolute',
	top: 12,
	right: 12,
	display: 'flex',
	gap: 6,
})
export const graphHint = style({
	fontSize: 12,
	lineHeight: 1.5,
	color: vars.colors.text.secondary,
	padding: '12px 18px',
	margin: 0,
})
export const node = style({
	cursor: 'pointer',
	outline: 'none',
})
export const profile = style([
	panel,
	{
		position: 'sticky',
		top: 88,
		maxHeight: '82svh',
		overflowY: 'auto',
		'@media': {
			'(max-width: 1199px)': {
				position: 'fixed',
				top: 'auto',
				bottom: 0,
				left: 0,
				right: 0,
				maxHeight: '65svh',
				zIndex: 1150,
				borderRadius: '24px 24px 0 0',
				paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
				boxShadow: '0 -16px 60px #0003',
			},
		},
	},
])
export const placeholder = style([
	panel,
	{
		color: vars.colors.text.secondary,
		lineHeight: 1.7,
		'@media': { '(max-width: 1199px)': { display: 'none' } },
	},
])
export const profileTitle = style({
	fontFamily: vars.font.heading,
	fontSize: vars.fontSize.large,
	fontWeight: vars.fontWeight.bold,
	margin: '8px 0',
})
export const muted = style({
	color: vars.colors.text.secondary,
	fontSize: '0.85em',
	lineHeight: 1.65,
})
export const row = style({
	display: 'flex',
	gap: 12,
	alignItems: 'center',
	justifyContent: 'space-between',
	flexWrap: 'wrap',
})
export const chip = style([
	button,
	{
		borderRadius: vars.borderRadius.full,
		fontSize: 12,
		background: vars.colors.background.gray,
	},
])
export const list = style({
	display: 'grid',
	gap: 8,
	padding: 16,
	maxHeight: '70svh',
	overflow: 'auto',
})
export const listItem = style([
	button,
	{ justifyContent: 'space-between', textAlign: 'left', padding: 16 },
])
export const legend = style({
	display: 'flex',
	gap: 16,
	flexWrap: 'wrap',
	fontSize: 12,
	color: vars.colors.text.secondary,
})
export const catalog = style({
	marginTop: 28,
	padding: 20,
	lineHeight: 1.7,
})
export const fallbackGrid = style({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
	gap: 20,
	marginTop: 20,
})
globalStyle(
	`${atlas} button:focus-visible, ${atlas} a:focus-visible, ${atlas} input:focus-visible, ${atlas} select:focus-visible`,
	{ outline: `3px solid ${vars.colors.primary}`, outlineOffset: 3 },
)
globalStyle(`${atlas} fieldset legend`, { fontWeight: 600, marginBottom: 8 })
globalStyle(`${atlas} input[type="checkbox"]`, {
	width: 18,
	height: 18,
	accentColor: 'var(--leaf)',
	appearance: 'auto',
	minWidth: 18,
	minHeight: 18,
	padding: 0,
	flexShrink: 0,
	borderRadius: 3,
})
globalStyle(`${atlas} p`, { margin: 0 })
globalStyle(`${atlas} summary`, {
	cursor: 'pointer',
	minHeight: 44,
	fontWeight: 600,
})
globalStyle(`${atlas} a`, { color: 'inherit', textUnderlineOffset: 3 })

globalStyle(`${node}:focus-visible > circle`, {
	stroke: vars.colors.text.regular,
	strokeWidth: 4,
})

globalStyle(`${atlas}[data-expanded="true"] > header`, { display: 'none' })
globalStyle(`${atlas} input[type="search"]`, { textAlign: 'left' })

export const familyLegend = style({
	display: 'flex',
	justifyContent: 'center',
	flexWrap: 'wrap',
	gap: '12px 22px',
	padding: '0 20px 22px',
	fontSize: 11,
})
globalStyle(`${familyLegend} span`, {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 7,
})
globalStyle(`${familyLegend} i`, { width: 7, height: 7, borderRadius: '50%' })

export const lineageSummary = style({
	display: 'grid',
	gap: 18,
	padding: '18px 0',
})
export const relativeButton = style([
	button,
	{
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: 4,
		width: '100%',
		textAlign: 'left',
		marginTop: 8,
	},
])
globalStyle(`${relativeButton} small`, {
	color: vars.colors.text.secondary,
	fontSize: 11,
	fontWeight: 400,
})
