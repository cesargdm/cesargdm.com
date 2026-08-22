import { style } from '@vanilla-extract/css'

import { BACKDROP, BACKDROP_HOVER, BEVEL } from '@/styles/glass.css'

/**
 * Glass for a button that has to keep a brand colour. The tint stays high so
 * white text keeps effectively the same contrast it had when the button was
 * solid — below about 0.8 the label starts competing with whatever shows
 * through, which is exactly the trade a CTA should not make.
 *
 * In its own file because it is a function, and `glass.css.ts` is imported by
 * `Layout.astro` for the refraction CSS — which makes vanilla-extract serialise
 * that module's exports, and a function does not survive that.
 *
 * No refraction here. A tint this opaque leaves almost nothing of the backdrop
 * to bend, so the displacement would cost a filter pass to show nothing.
 */
export function glassTint(color: string, hoverColor: string) {
	return style({
		backgroundColor: color,
		backdropFilter: BACKDROP,
		boxShadow: BEVEL,
		transition:
			'backdrop-filter 300ms, background-color 300ms, transform 260ms cubic-bezier(0.2, 0.8, 0.3, 1)',
		':hover': {
			backgroundColor: hoverColor,
			backdropFilter: BACKDROP_HOVER,
		},
	})
}
