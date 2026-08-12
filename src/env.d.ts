/// <reference path="../.astro/types.d.ts" />

import type { Theme } from '@/modules/Nav/ToggleTheme/ThemeButton'

declare global {
	namespace App {
		interface Locals {
			theme: Theme
		}
	}
}

export {}
