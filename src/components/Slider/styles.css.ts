import { globalStyle, style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

/**
 * How much of the track is filled, as a percentage.
 *
 * It arrives as a custom property rather than as an inline background because
 * the track is a pseudo-element, and a pseudo-element cannot be styled inline.
 * Only WebKit and Chromium need it — Firefox paints the filled part itself
 * through `::-moz-range-progress`.
 */
export const FILL_VAR = '--mosaic-slider-fill'

const TRACK_HEIGHT = '6px'
const THUMB_SIZE = '18px'

/*
 * `global.css` gives every `input` `appearance: none`, a 40px minimum box and a
 * pill radius, which on a range input does not restyle the control so much as
 * delete its track and thumb outright. Rather than opt back into the platform's
 * control, this draws the whole thing: one appearance across browsers, and a
 * filled track reads as a level rather than as a groove with a knob loose in it.
 */
export const slider = style({
	appearance: 'none',
	display: 'block',
	width: '100%',
	height: THUMB_SIZE,
	minWidth: 0,
	minHeight: 0,
	margin: 0,
	padding: 0,
	borderRadius: 0,
	backgroundColor: 'transparent',
	cursor: 'pointer',
	vars: { [FILL_VAR]: '0%' },
	selectors: {
		'&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
		'&:focus-visible': {
			outline: `2px solid ${vars.colors.primary}`,
			outlineOffset: 4,
			borderRadius: vars.borderRadius.full,
		},
	},
})

const thumb = {
	boxSizing: 'border-box',
	width: THUMB_SIZE,
	height: THUMB_SIZE,
	borderRadius: vars.borderRadius.full,
	border: `2px solid ${vars.colors.primary}`,
	backgroundColor: vars.colors.background.content,
	boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
} as const

/*
 * One `globalStyle` per vendor pseudo-element, deliberately. A browser drops a
 * whole rule whose selector it cannot parse, so grouping WebKit's and Firefox's
 * selectors together would lose both in both.
 */
globalStyle(`.${slider}::-webkit-slider-runnable-track`, {
	height: TRACK_HEIGHT,
	borderRadius: vars.borderRadius.full,
	backgroundImage: `linear-gradient(to right, ${vars.colors.primary} 0 var(${FILL_VAR}), ${vars.colors.background.gray} var(${FILL_VAR}) 100%)`,
})

globalStyle(`.${slider}::-webkit-slider-thumb`, {
	WebkitAppearance: 'none',
	// Centres the thumb on a track shorter than the thumb is tall.
	marginTop: `calc((${TRACK_HEIGHT} - ${THUMB_SIZE}) / 2)`,
	...thumb,
})

globalStyle(`.${slider}::-moz-range-track`, {
	height: TRACK_HEIGHT,
	borderRadius: vars.borderRadius.full,
	backgroundColor: vars.colors.background.gray,
})

globalStyle(`.${slider}::-moz-range-progress`, {
	height: TRACK_HEIGHT,
	borderRadius: vars.borderRadius.full,
	backgroundColor: vars.colors.primary,
})

globalStyle(`.${slider}::-moz-range-thumb`, thumb)
