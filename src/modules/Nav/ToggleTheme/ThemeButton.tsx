import { useMemo } from 'react'
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react'

import { toggleTheme } from '@/modules/Nav/ToggleTheme/styles.css'

import type { Locale } from '@/lib/i18n'
import { getTranslate } from '@/lib/translate'

type Props = {
	locale: Locale
	value?: Theme
	onChange?: () => void
}

export type Theme = 'dark' | 'light' | ''

export const CookieName = 'theme'

export default function ThemeButton({ locale, value, onChange }: Props) {
	const t = useMemo(() => getTranslate(locale), [locale])

	const themeIcon = useMemo(() => {
		if (value === 'dark') return <IconSun key="sun" />
		if (value === 'light') return <IconSunMoon key="sun-moon" />
		return <IconMoon key="moon" />
	}, [value])

	return (
		<button
			title={t('nav.theme.toggle')}
			className={toggleTheme}
			onClick={onChange}
		>
			{themeIcon}
		</button>
	)
}
