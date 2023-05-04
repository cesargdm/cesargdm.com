import { ReactNode } from 'react'

import { articleContainer } from './styles.css'

export default function PostTemplate({ children }: { children: ReactNode }) {
	return <div className={articleContainer}>{children}</div>
}
