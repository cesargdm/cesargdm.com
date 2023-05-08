'use client'

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { darkTheme, lightTheme, responsiveTheme } from '@/app/theme.css'
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react'
import { toggleTheme } from './styles.css'

function ToggleTheme() {
	const [theme, setTheme] = useState(Cookies.get('theme'))

	useEffect(() => {
		Cookies.set(
			'visits-count',
			String(Number(Cookies.get('visits-count')) + 1 || 1),
		)
	}, [])

	useEffect(() => {
		document.body.classList.remove(lightTheme)
		document.body.classList.remove(responsiveTheme)
		document.body.classList.remove(darkTheme)

		if (!theme) {
			Cookies.set('theme', '')
			document.body.classList.add(responsiveTheme)
		}
		if (theme === 'dark') {
			Cookies.set('theme', 'dark')
			document.body.classList.add(darkTheme)
		}
		if (theme === 'light') {
			Cookies.set('theme', 'light')
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
