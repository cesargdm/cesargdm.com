import { IconSearch } from '@tabler/icons-react'

import { navLink } from './styles.css'

type Props = { onClick?: () => void; isOpen: boolean }

export default function Search({ isOpen, ...props }: Props) {
	return (
		<button {...props} className={navLink}>
			{isOpen ? 'Close' : <IconSearch />}
		</button>
	)
}
