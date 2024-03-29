import { vars } from '@/app/theme.css'

import { globalStyle, style } from '@vanilla-extract/css'

export const notFoundContainer = style({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	margin: 'auto',
	gridColumn: '1 / -1',
	gap: vars.space.xlarge,
})

globalStyle(`${notFoundContainer} a`, {
	display: 'block',
	textAlign: 'center',
	fontWeight: 'bold',
})

export const entryContainer = style({
	display: 'grid',
	margin: '0 auto',
	gap: vars.space.xxlarge,
	maxWidth: vars.sizes.maxWidthPage,
	'@media': {
		'(min-width: 768px)': {
			gridTemplateColumns: '2fr 1fr',
		},
	},
})

globalStyle(`${entryContainer} > *`, {
	minWidth: 0,
})

globalStyle(`${entryContainer} hr `, {
	border: 'none',
	margin: `${vars.space.xxlarge} 0`,
	borderTop: `1px solid ${vars.colors.border}`,
})

export const articleContainer = style({
	display: 'flex',
	flexDirection: 'column',
	fontSize: vars.fontSize.large,
})

export const nonTechnicalEntry = style([
	articleContainer,
	{ textAlign: 'justify' },
])

globalStyle(`${nonTechnicalEntry} > p:nth-child(2)::first-letter`, {
	initialLetter: 3,
})

globalStyle(`${articleContainer} h1`, {
	fontSize: vars.fontSize.xxxlarge,
	marginBottom: vars.fontSize.xxlarge,
})

globalStyle(`${articleContainer} blockquote`, {
	fontStyle: 'italic',
	paddingLeft: vars.fontSize.small,
	color: vars.colors.text.secondary,
	margin: `${vars.fontSize.large} 0`,
	borderLeft: `4px solid ${vars.colors.text.secondary}`,
})

globalStyle(`${articleContainer} blockquote p`, {
	marginBottom: 0,
})

globalStyle(`${articleContainer} pre`, {
	fontFamily: 'monospace',
	overflowX: 'auto',
	padding: vars.space.large,
	marginBottom: vars.space.large,
	borderRadius: vars.borderRadius.medium,
	backgroundColor: vars.colors.background.content,
})

globalStyle(`${articleContainer} h2`, {
	fontSize: vars.fontSize.xxlarge,
	marginBottom: vars.fontSize.xxlarge,
})

globalStyle(`${articleContainer} p`, {
	lineHeight: '1.65',
	marginBottom: vars.fontSize.large,
	fontSize: vars.fontSize.large,
})
