import { globalStyle, style } from '@vanilla-extract/css'
import { vars } from '../theme.css'

export const contactList = style({
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	gap: vars.space.xlarge,
})

globalStyle(`${contactList} a`, {
	display: 'flex',
	alignItems: 'center',
	fontWeight: 'bold',
	gap: vars.space.small,
	flexDirection: 'column',
})
