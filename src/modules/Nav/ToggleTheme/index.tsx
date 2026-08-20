import { useCallback, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import type { Theme } from '@/modules/Nav/ToggleTheme/ThemeButton'
import ThemeButton, { CookieName } from '@/modules/Nav/ToggleTheme/ThemeButton'

import { darkTheme, lightTheme, responsiveTheme } from '@/styles/theme.css'

const THEME_CLASSES: Record<Theme, string> = {
	'': responsiveTheme,
	dark: darkTheme,
	light: lightTheme,
}

const NEXT_THEME: Record<Theme, Theme> = {
	'': 'dark',
	dark: 'light',
	light: '',
}

/**
 * Applied to <html>, matching the inline script in Layout.astro that sets the
 * theme before first paint. They have to target the same element or the two
 * disagree about which theme is active.
 */
function applyTheme(theme: Theme) {
	const { classList } = document.documentElement

	classList.remove(responsiveTheme, darkTheme, lightTheme)
	classList.add(THEME_CLASSES[theme])
}

/**
 * The theme is read from the cookie on the client, not passed in as a prop:
 * these pages are prerendered, so `Astro.locals` is empty at build time and any
 * server-provided value would always be the default.
 */
function ToggleTheme() {
	const [theme, setTheme] = useState<Theme>(
		() => (Cookies.get(CookieName) ?? '') as Theme,
	)

	useEffect(() => {
		Cookies.set(
			'visits-count',
			String(Number(Cookies.get('visits-count')) + 1 || 1),
		)
	}, [])

	useEffect(() => {
		Cookies.set(CookieName, theme)
		applyTheme(theme)
	}, [theme])

	// Reapply after a client-side navigation: ClientRouter copies the incoming
	// document's <html> attributes over the live ones, resetting the class.
	useEffect(() => {
		const reapply = () => applyTheme(theme)

		document.addEventListener('astro:after-swap', reapply)

		return () => document.removeEventListener('astro:after-swap', reapply)
	}, [theme])

	const handleToggleTheme = useCallback(() => {
		// Functional update: reading `theme` here captured the first render's
		// value, so the toggle advanced once and then stuck.
		setTheme((current) => NEXT_THEME[current])
	}, [])

	return <ThemeButton value={theme} onChange={handleToggleTheme} />
}

export default ToggleTheme
