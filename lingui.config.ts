import { defineConfig } from '@lingui/cli'
import { formatter } from '@lingui/format-po'

/*
 * Message ids are explicit keys rather than English source text, because
 * Lingui's macros do not run inside `.astro` frontmatter — the Astro compiler
 * consumes it before any Babel transform could. Every call site therefore uses
 * the runtime `t('id')` form (see src/lib/translate.ts).
 *
 * `explicitIdAsDefault` is what makes that work: without it the formatter reads
 * each `msgid` as source text and compiles it to a content hash, so every
 * lookup by key misses and the id renders verbatim.
 */
export default defineConfig({
	locales: ['en', 'es'],
	sourceLocale: 'en',
	catalogs: [{ path: '<rootDir>/src/locales/{locale}', include: ['src'] }],
	format: formatter({ explicitIdAsDefault: true }),
})
