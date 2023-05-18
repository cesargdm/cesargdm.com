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

globalStyle(`${entryContainer} article a`, {
	color: vars.colors.primary,
})

globalStyle(`${entryContainer} article blockquote`, {
	margin: `${vars.space.large} 0`,
	marginBottom: vars.space.xxlarge,
	paddingLeft: vars.space.large,
	position: 'relative',
	color: vars.colors.text.secondary,
})

globalStyle(`${entryContainer} article blockquote p:last-child`, {
	marginBottom: 0,
})

globalStyle(`${entryContainer} article blockquote:before`, {
	content: '""',
	position: 'absolute',
	top: 0,
	left: 0,
	width: '4px',
	height: '100%',
	borderRadius: '4px',
	backgroundColor: vars.colors.text.decorative,
})

globalStyle(`${entryContainer} article ul`, {
	margin: `${vars.space.large} 0`,
})

globalStyle(`${entryContainer} article ul li`, {
	marginBottom: vars.space.large,
	listStyle: 'inside',
	paddingLeft: vars.space.large,
})
