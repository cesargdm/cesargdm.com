/**
 * Writes the Content-Security-Policy line in public/_headers from
 * src/lib/content-security-policy.ts. Middleware reads the same export directly.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { CONTENT_SECURITY_POLICY } = await import(
	pathToFileURL(join(root, 'src/lib/content-security-policy.ts')).href
)

const headersPath = join(root, 'public/_headers')
const headers = readFileSync(headersPath, 'utf8')
if (!/^ {2}Content-Security-Policy: /m.test(headers)) {
	process.stderr.write(
		'public/_headers is missing a Content-Security-Policy line on /*\n',
	)
	process.exit(1)
}

const next = headers.replace(
	/^ {2}Content-Security-Policy: .+$/m,
	`  Content-Security-Policy: ${CONTENT_SECURITY_POLICY}`,
)

if (next === headers) {
	process.stdout.write(
		'public/_headers already matches content-security-policy.ts\n',
	)
	process.exit(0)
}

writeFileSync(headersPath, next)
process.stdout.write('Updated Content-Security-Policy in public/_headers\n')
