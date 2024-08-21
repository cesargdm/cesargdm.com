import { IconSearch } from '@tabler/icons-react'

import { navLink } from './styles.css'

type Props = { onClick?: () => void; isOpen: boolean }

export default function Search({ isOpen, ...props }: Props) {
	return (
		<button {...props} className={navLink} aria-label="Search">
			{isOpen ? 'Close' : <IconSearch size={22} strokeWidth={2.5} />}
		</button>
	)
}
