import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { includeIgnoreFile } from '@eslint/compat'
import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

/*
 * ESLint is scoped to `.astro` files and nothing else — oxlint covers every
 * `.ts`/`.tsx` file (see .oxlintrc.json).
 *
 * It stays for one reason: oxlint parses `.astro` files only as far as their
 * `<script>` blocks, so it cannot see the markup. Most of this site's HTML
 * lives in `.astro` templates, and dropping this config would silently stop
 * enforcing a11y on it — the exact gap that had to be fixed once already when
 * the site moved off Next.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

export default [
	includeIgnoreFile(gitignorePath),
	{
		ignores: ['dist/', '.astro/', '.wrangler/', '**/*.d.ts'],
	},
	...eslintPluginAstro.configs.recommended,
	{
		// astro-eslint-parser hands the frontmatter block to a TypeScript parser.
		// Without this it parses as plain JS and every `as` cast or typed
		// destructure is a syntax error — which only shows up on a clean install,
		// since a stale node_modules still resolves the parser.
		files: ['**/*.astro'],
		languageOptions: {
			parserOptions: { parser: tseslint.parser },
		},
	},
	...eslintPluginAstro.configs['flat/jsx-a11y-strict'],
	{
		// Astro compiles each frontmatter block to a virtual `*.astro/N.ts` file.
		// Those are already covered by oxlint through the real source file, and
		// linting them here only produces duplicate reports.
		ignores: ['**/*.astro/*.ts', '**/*.astro/*.tsx'],
	},
]
