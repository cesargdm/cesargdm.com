import { vars } from '@/app/theme.css'
import { globalStyle, style } from '@vanilla-extract/css'

export const entryContainer = style({
	gap: vars.space.large,
	margin: '0 auto',
	maxWidth: '900px',
})

globalStyle(`${entryContainer} article`, {
	display: 'flex',
	textAlign: 'justify',
	flexDirection: 'column',
	fontSize: vars.fontSize.large,
})

globalStyle(`${entryContainer} article h1`, {
	fontSize: vars.fontSize.xxxlarge,
	marginBottom: '1rem',
})

globalStyle(`${entryContainer} article h2`, {
	fontSize: vars.fontSize.xxlarge,
	marginBottom: '1rem',
})

globalStyle(`${entryContainer} article p`, {
	marginBottom: '1rem',
	lineHeight: '1.5',
	fontSize: vars.fontSize.large,
})
