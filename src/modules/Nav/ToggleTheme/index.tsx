'use client'

import { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import type { Theme } from '@/modules/Nav/ToggleTheme/ThemeButton'
import ThemeButton, { CookieName } from '@/modules/Nav/ToggleTheme/ThemeButton'

import { darkTheme, lightTheme, responsiveTheme } from '@/app/theme.css'

function ToggleTheme({
	initialTheme = Cookies.get(CookieName) as Theme,
}: {
	initialTheme: Theme
}) {
	const [theme, setTheme] = useState(initialTheme)

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
			Cookies.set(CookieName, '')
			document.body.classList.add(responsiveTheme)
		}
		if (theme === 'dark') {
			Cookies.set(CookieName, 'dark')
			document.body.classList.add(darkTheme)
		}
		if (theme === 'light') {
			Cookies.set(CookieName, 'light')
			document.body.classList.add(lightTheme)
		}
	}, [theme])

	const handleToggleTheme = useCallback(() => {
		if (!theme) {
			setTheme('dark')
		} else if (theme === 'dark') {
			setTheme('light')
		} else if (theme === 'light') {
			setTheme('')
		}
	}, [])

	return <ThemeButton value={theme} onChange={handleToggleTheme} />
}

export default ToggleTheme
