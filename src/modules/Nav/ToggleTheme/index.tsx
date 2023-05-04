'use client'

import { useEffect, useState } from 'react'
import cookieCutter from 'cookie-cutter'

import { darkTheme, lightTheme, responsiveTheme } from '@/app/theme.css'
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react'
import { toggleTheme } from './styles.css'

function ToggleTheme() {
	const [theme, setTheme] = useState(cookieCutter.get('theme'))

	useEffect(() => {
		document.body.classList.remove(lightTheme)
		document.body.classList.remove(responsiveTheme)
		document.body.classList.remove(darkTheme)

		if (!theme) {
			cookieCutter.set('theme', '')
			document.body.classList.add(responsiveTheme)
		}
		if (theme === 'dark') {
			cookieCutter.set('theme', 'dark')
			document.body.classList.add(darkTheme)
		}
		if (theme === 'light') {
			cookieCutter.set('theme', 'light')
			document.body.classList.add(lightTheme)
		}
	}, [theme])

	function handleToggleTheme() {
		if (!theme) {
			setTheme('dark')
		} else if (theme === 'dark') {
			setTheme('light')
		} else if (theme === 'light') {
			setTheme('')
		}
	}

	return (
		<button
			title="Toggle theme"
			className={toggleTheme}
			onClick={handleToggleTheme}
		>
			{theme === 'dark' && <IconSun />}
			{theme === 'light' && <IconSunMoon />}
			{!theme && <IconMoon />}
		</button>
	)
}

export default ToggleTheme
