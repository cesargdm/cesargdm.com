import { useEffect, useId, useRef, useState } from 'react'

import * as styles from './styles.css'

/**
 * A control's label with its explanation behind a `?`.
 *
 * The panel floats over the controls rather than sitting in the flow: these
 * explanations are a couple of lines each, and opening one used to push every
 * control below it down the column — so reading about a slider moved the slider
 * out from under the pointer.
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
	const hintId = useId()
	const rowRef = useRef<HTMLSpanElement | null>(null)

	// A floating panel has to be dismissible without hitting the same button
	// again — it covers whatever is under it, and on touch there is no way to
	// hover away from it.
	useEffect(() => {
		if (!open) return

		function onPointerDown(event: PointerEvent) {
			const target = event.target
			if (target instanceof Node && rowRef.current?.contains(target)) return
			setOpen(false)
		}

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') setOpen(false)
		}

		document.addEventListener('pointerdown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('pointerdown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [open])

	return (
		<span className={styles.labelRow} ref={rowRef}>
			<label className={styles.label} htmlFor={htmlFor}>
				{children}
			</label>
			<button
				aria-controls={open ? hintId : undefined}
				aria-expanded={open}
				aria-label={`${explain}: ${children}`}
				className={styles.infoButton}
				onClick={() => setOpen((wasOpen) => !wasOpen)}
				title={hint}
				type="button"
			>
				?
			</button>
			{open ? (
				<span className={styles.hintPopover} id={hintId}>
					{hint}
				</span>
			) : null}
		</span>
	)
}
