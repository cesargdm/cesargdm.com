import { useMemo } from 'react'
import { IconSearch } from '@tabler/icons-react'

import type { Locale } from '@/lib/i18n'
import { getTranslate } from '@/lib/translate'

import { navLink } from './styles.css'

type Props = { onClick?: () => void; isOpen: boolean; locale: Locale }

export default function Search({ isOpen, locale, ...props }: Props) {
	const t = useMemo(() => getTranslate(locale), [locale])

	return (
		<button {...props} className={navLink} aria-label={t('nav.search.label')}>
			{isOpen ? (
				t('nav.search.close')
			) : (
				<IconSearch size={22} strokeWidth={2.5} />
			)}
		</button>
	)
}
