import { vars } from '@/app/theme.css'
import { globalStyle, style } from '@vanilla-extract/css'

export const articleContainer = style({
	display: 'grid',
	gridTemplateColumns: '1fr 150px',
	gap: vars.space.large,
	margin: '0 auto',
	maxWidth: '900px',
})

globalStyle(`${articleContainer} article`, {
	display: 'flex',
	textAlign: 'justify',
	flexDirection: 'column',
	fontSize: vars.fontSize.large,
})
globalStyle(`${articleContainer} article > p:nth-child(2)::first-letter`, {
	initialLetter: 3,
})

globalStyle(`${articleContainer} article h1`, {
	fontSize: vars.fontSize.xxxlarge,
	marginBottom: '1rem',
	fontFamily: 'serif',
})

globalStyle(`${articleContainer} article h2`, {
	fontSize: vars.fontSize.xxlarge,
	marginBottom: '1rem',
})

globalStyle(`${articleContainer} article p`, {
	marginBottom: '1rem',
	lineHeight: '1.5',
	fontSize: vars.fontSize.large,
})
