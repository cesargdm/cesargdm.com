import { style } from '@vanilla-extract/css'

import { cardButton } from '@/modules/card.css'
import { glassTint } from '@/styles/glass.css'
import { vars } from '@/styles/theme.css'

export const profileButton = style([
	cardButton,
	// A high tint rather than a translucent one: the brand colour has to survive
	// and white-on-blue has to keep its contrast.
	glassTint('rgba(15, 111, 214, 0.88)', 'rgba(11, 87, 168, 0.94)'),
])

export const postParagraph = style({
	fontSize: vars.fontSize.large,
	padding: `${vars.space.large} 0`,
	margin: 'auto',
	textAlign: 'center',
})

export const bioParagraph = style({
	whiteSpace: 'pre-line',
	textAlign: 'center',
	margin: 'auto',
	padding: `${vars.space.large} 0`,
})
