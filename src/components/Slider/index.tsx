import type { ComponentProps, CSSProperties } from 'react'

import { FILL_VAR, slider } from './styles.css'

const PERCENT = 100

/**
 * A range input drawn end to end rather than left to the platform.
 *
 * The filled portion is computed here because WebKit has no pseudo-element for
 * it: the track is painted as a two-stop gradient whose stop position comes in
 * as a custom property. Firefox has `::-moz-range-progress` and ignores it.
 */
function Slider({
	max = PERCENT,
	min = 0,
	value,
	...props
}: ComponentProps<'input'>) {
	const low = Number(min)
	const span = Number(max) - low
	const filled = span > 0 ? (Number(value) - low) / span : 0

	// An intersection rather than a cast: React's CSSProperties deliberately has
	// no index signature, so a custom property is not assignable on its own.
	const fill: CSSProperties & Record<typeof FILL_VAR, string> = {
		[FILL_VAR]: `${filled * PERCENT}%`,
	}

	return (
		<input
			{...props}
			className={slider}
			max={max}
			min={min}
			style={fill}
			type="range"
			value={value}
		/>
	)
}

export default Slider
