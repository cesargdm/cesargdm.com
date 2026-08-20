import { readFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

/*
 * Lingui's extractor is blind to this project: its macros do not run inside
 * .astro frontmatter, so every call site uses the runtime `t('id')` form and
 * the catalogs in src/locales are written by hand. This replaces what the
 * extractor would otherwise have caught — an id declared but never translated,
 * or a translation left behind after its id was deleted.
 */

const root = fileURLToPath(new URL('..', import.meta.url))

function readMessageIds() {
	const source = readFileSync(`${root}src/lib/message-ids.ts`, 'utf8')
	const body = source.slice(
		source.indexOf('MESSAGE_IDS = ['),
		source.indexOf('] as const'),
	)

	return [...body.matchAll(/'([^']+)'/g)].map(([, id]) => id)
}

function readCatalog(locale) {
	const source = readFileSync(`${root}src/locales/${locale}.po`, 'utf8')
	const entries = new Map()

	for (const [, id, value] of source.matchAll(
		/^msgid "([^"]+)"\nmsgstr "([^"]*)"/gm,
	)) {
		entries.set(id, value)
	}

	return entries
}

const ids = readMessageIds()
const problems = []

const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)
if (duplicates.length) {
	problems.push(`duplicate ids in message-ids.ts: ${duplicates.join(', ')}`)
}

for (const locale of ['en', 'es']) {
	const catalog = readCatalog(locale)

	const missing = ids.filter((id) => !catalog.get(id)?.trim())
	if (missing.length) {
		problems.push(`${locale}.po is missing: ${missing.join(', ')}`)
	}

	const orphaned = [...catalog.keys()].filter((id) => !ids.includes(id))
	if (orphaned.length) {
		problems.push(`${locale}.po translates unknown ids: ${orphaned.join(', ')}`)
	}
}

if (problems.length) {
	for (const problem of problems) console.error(`✗ ${problem}`)
	process.exit(1)
}

console.warn(`✓ ${ids.length} messages, en and es both complete`)
