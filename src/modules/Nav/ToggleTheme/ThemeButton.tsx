import { useMemo } from 'react'
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react'

import { toggleTheme } from '@/modules/Nav/ToggleTheme/styles.css'

type Props = {
	value?: Theme
	onChange?: () => void
}

export type Theme = 'dark' | 'light' | ''

export const CookieName = 'theme'

export default function ThemeButton({ value, onChange }: Props) {
	const themeIcon = useMemo(() => {
		if (value === 'dark') return <IconSun key="sun" />
		if (value === 'light') return <IconSunMoon key="sun-moon" />
		return <IconMoon key="moon" />
	}, [value])

	return (
		<button title="Toggle theme" className={toggleTheme} onClick={onChange}>
			{themeIcon}
		</button>
	)
}
