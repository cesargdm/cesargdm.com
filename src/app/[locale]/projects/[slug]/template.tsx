import type { ReactNode } from 'react'

import { entryContainer } from './styles.css'

export default function PostTemplate({ children }: { children: ReactNode }) {
	return <div className={entryContainer}>{children}</div>
}
