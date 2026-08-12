/// <reference path="../.astro/types.d.ts" />

import type { Theme } from '@/modules/Nav/ToggleTheme/ThemeButton'

declare namespace App {
	interface Locals {
		theme: Theme
	}
}
