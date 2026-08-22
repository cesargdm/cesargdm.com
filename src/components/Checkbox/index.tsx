import type { ComponentProps } from 'react'

import { checkbox } from './styles.css'

/**
 * A checkbox drawn end to end rather than left to the platform.
 *
 * Still a real `<input type="checkbox">` underneath, so it keeps the native
 * focus, keyboard and assistive-technology behaviour for free; only its
 * appearance is replaced.
 */
function Checkbox(props: ComponentProps<'input'>) {
	return <input {...props} className={checkbox} type="checkbox" />
}

export default Checkbox
