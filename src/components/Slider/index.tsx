import { useState } from 'react'
import type { ChangeEvent, ComponentProps, CSSProperties } from 'react'

import { FILL_VAR, slider } from './styles.css'

const PERCENT = 100

/**
 * A range input drawn end to end rather than left to the platform.
 *
 * The filled portion is computed here because WebKit has no pseudo-element for
 * it: the track is painted as a two-stop gradient whose stop position comes in
 * as a custom property. Firefox has `::-moz-range-progress` and ignores it.
 *
 * That makes the fill the one thing this component has to know that the DOM
 * would otherwise keep to itself, so an uncontrolled slider is mirrored into
 * state — without it the track would sit empty while the thumb moved.
 */
function Slider({
	className,
	defaultValue,
	max = PERCENT,
	min = 0,
	onChange,
	style,
	value,
	...props
}: ComponentProps<'input'>) {
	const [uncontrolled, setUncontrolled] = useState(defaultValue ?? min)
	const current = value ?? uncontrolled

	const low = Number(min)
	const span = Number(max) - low
	const ratio = span > 0 ? (Number(current) - low) / span : 0
	// A non-finite ratio would put `NaN%` in the gradient and invalidate the
	// whole declaration, which loses the track rather than just the fill.
	const filled = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		// Only when uncontrolled. With a `value` prop the parent owns it, and
		// mirroring it here would just be a second source of the same truth.
		if (value === undefined) setUncontrolled(event.currentTarget.value)
		onChange?.(event)
	}

	// An intersection rather than a cast: React's CSSProperties deliberately has
	// no index signature, so a custom property is not assignable on its own.
	const fill: CSSProperties & Record<typeof FILL_VAR, string> = {
		...style,
		[FILL_VAR]: `${filled * PERCENT}%`,
	}

	return (
		<input
			{...props}
			className={className ? `${slider} ${className}` : slider}
			defaultValue={defaultValue}
			max={max}
			min={min}
			onChange={handleChange}
			style={fill}
			type="range"
			value={value}
		/>
	)
}

export default Slider
