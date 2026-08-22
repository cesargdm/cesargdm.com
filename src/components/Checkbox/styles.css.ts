import { style } from '@vanilla-extract/css'

import { vars } from '@/styles/theme.css'

const BOX_SIZE = '1.15rem'

/*
 * `global.css` gives every `input` `appearance: none`, a 40px minimum box and a
 * pill radius, which leaves a checkbox with no box and no tick at all in WebKit
 * and Chromium. So the control is drawn here instead of opted back into: a
 * rounded square that fills with the accent colour, and a tick built from two
 * borders rather than a glyph, which stays crisp at any zoom.
 */
export const checkbox = style({
	appearance: 'none',
	position: 'relative',
	boxSizing: 'border-box',
	flexShrink: 0,
	width: BOX_SIZE,
	height: BOX_SIZE,
	minWidth: 0,
	minHeight: 0,
	margin: 0,
	padding: 0,
	borderRadius: '6px',
	border: `1px solid ${vars.colors.border}`,
	backgroundColor: vars.colors.background.content,
	cursor: 'pointer',
	transition: 'background-color 140ms ease, border-color 140ms ease',
	// White on #3B82F6 is ~3.7:1 — short of the 4.5:1 that text needs, which is
	// why the buttons avoid it, but past the 3:1 that WCAG 1.4.11 asks of a
	// graphic like this tick.
	'::after': {
		content: '""',
		position: 'absolute',
		top: '45%',
		left: '50%',
		width: '5px',
		height: '9px',
		transform: 'translate(-50%, -50%) rotate(45deg)',
		borderRight: '2px solid #FFFFFF',
		borderBottom: '2px solid #FFFFFF',
		opacity: 0,
	},
	selectors: {
		'&:checked': {
			backgroundColor: vars.colors.primary,
			borderColor: vars.colors.primary,
		},
		'&:checked::after': { opacity: 1 },
		'&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
		'&:focus-visible': {
			outline: `2px solid ${vars.colors.primary}`,
			outlineOffset: 2,
		},
	},
	'@media': {
		'(prefers-reduced-motion: reduce)': { transition: 'none' },
	},
})
