import { useState } from 'react'

import * as styles from './styles.css'

/**
 * A control's label with its explanation behind an [i].
 *
 * The explanations are long enough that showing all of them at once buries the
 * controls they describe. `title` gives the hover for free and the button gives
 * a click target, so it works by pointer, by keyboard and by touch without a
 * popover to position.
 */
export function InfoLabel({
	children,
	explain,
	hint,
	htmlFor,
}: {
	children: string
	explain: string
	hint: string
	htmlFor?: string
}) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<span className={styles.labelRow}>
				<label className={styles.label} htmlFor={htmlFor}>
					{children}
				</label>
				<button
					aria-expanded={open}
					aria-label={`${explain}: ${children}`}
					className={styles.infoButton}
					onClick={() => setOpen((wasOpen) => !wasOpen)}
					title={hint}
					type="button"
				>
					i
				</button>
			</span>
			{open ? <p className={styles.hint}>{hint}</p> : null}
		</>
	)
}
