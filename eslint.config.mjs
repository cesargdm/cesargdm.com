/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'
import eslint from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginReact from 'eslint-plugin-react'
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

const importSortConfig = [
	'warn',
	{
		groups: [
			// Packages `node` or `react` related packages come first.
			['^node:', '^react-?(dom|native)?$', '^@?\\w'],
			// Internal packages.
			['^@/(screens|navigation|containers)(/.*|$)'],
			['^@/modules(/.*|$)'],
			['^@/components(/.*|$)'],
			['^@/(lib|utils)(/.*|$)'],
			['^@(/.*|$)'],
			// Side effect imports.
			['^\\u0000'],
			// Parent imports. Put `..` last.
			['^\\.\\.(?!/?$)', '^\\.\\./?$'],
			// Other relative imports. Put same-folder imports and `.` last.
			['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
			// Style imports.
			['^.+\\.?(css)$'],
		],
	},
]

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
	includeIgnoreFile(gitignorePath),
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				projectService: true,
				ecmaFeatures: { jsx: true },
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	jsxA11y.flatConfigs.strict,
	pluginReact.configs.flat['jsx-runtime'],
	{
		rules: {
			'no-magic-numbers': ['warn', { ignore: [-1, 0, 1, 2] }],
			'no-console': 'warn',
			'react/jsx-no-useless-fragment': 'warn',
			'react/jsx-key': 'error',
			'react/jsx-boolean-value': ['warn', 'never'],
			'react/jsx-no-leaked-render': 'error',
			'react/function-component-definition': [
				'warn',
				{ namedComponents: 'function-declaration' },
			],
			'@typescript-eslint/no-misused-promises': [
				'error',
				{ checksVoidReturn: false },
			],
			'@typescript-eslint/no-import-type-side-effects': 'error',
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{ fixStyle: 'separate-type-imports' },
			],
			'simple-import-sort/imports': importSortConfig,
		},
		plugins: {
			'simple-import-sort': pluginSimpleImportSort,
		},
	},
]
