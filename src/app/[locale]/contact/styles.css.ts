import { vars } from '@/app/theme.css'

import { globalStyle, style } from '@vanilla-extract/css'

export const contactList = style({
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	gap: vars.space.xlarge,
})

export const contactHeading = style({
	textAlign: 'center',
	width: '100%',
	display: 'block',
	marginBottom: vars.space.xlarge,
})

globalStyle(`${contactList} a`, {
	display: 'flex',
	alignItems: 'center',
	fontWeight: 'bold',
	gap: vars.space.small,
	flexDirection: 'column',
})
