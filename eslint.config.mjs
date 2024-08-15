import globals from 'globals'
import pluginJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'

import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default [
	{
		files: ['src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		rules: {
			'no-magic-numbers': ['warn', { ignore: [-1, 0, 1, 2] }],
			'no-console': 'warn',
		},
		languageOptions: {
			globals: globals.browser,
		},
	},
	includeIgnoreFile(gitignorePath),
	pluginJs.configs.recommended,
	...tsEslint.configs.recommended,
	jsxA11y.flatConfigs.strict,
	pluginReact.configs.flat['jsx-runtime'],
]
