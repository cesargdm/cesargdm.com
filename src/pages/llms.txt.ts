import type { APIRoute } from 'astro'

import { getPosts } from '@/lib/blog'
import { BASE_URL } from '@/lib/constants'
import { text } from '@/lib/frontmatter'
import { getProjects } from '@/lib/projects'

export const prerender = true

type Entry = { slug: string; data: Record<string, unknown> }

/**
 * llmstxt.org asks for one bullet per resource, as
 * `- [title](url): description`. The description is optional in the spec but it
 * is the whole point here — a list of bare links tells a model nothing it could
 * not have guessed from the slug.
 */
function toLink(section: string, entry: Entry) {
	const title = text(entry.data.title) || entry.slug
	// Projects carry `description`; posts carry `extract`. Neither is guaranteed.
	const description = text(entry.data.description) || text(entry.data.extract)
	const url = `${BASE_URL}/en/${section}/${entry.slug}`

	return description
		? `- [${title}](${url}): ${description}`
		: `- [${title}](${url})`
}

export const GET: APIRoute = () => {
	const projects = getProjects('en')
	const posts = getPosts('en')

	const body = `# César Guadarrama Cantú

> Product engineer in Mexico City. I build for the web and for phones — currently
> at OCHO, with TOLO (a coffee company running on Cloudflare Workers) and Cretia
> as ongoing projects. This site is Astro on Cloudflare Workers; its source is
> public.

Everything below is available in English under /en/ and in Spanish under /es/.
The Spanish pages are translations, not separate content, though a few entries
exist in only one language.

## Projects

${projects.map((entry) => toLink('projects', entry)).join('\n')}

## Writing

${posts.map((entry) => toLink('blog', entry)).join('\n')}

## Tools

- [QR Code Generator](${BASE_URL}/en/projects/qr-code-generator): Generate a QR code from any text and download it as SVG or PNG, entirely in the browser.

## Optional

- [Contact](${BASE_URL}/en/contact): Where to find me, and the links I keep current.
- [AI Chat](${BASE_URL}/en/chat): A chat grounded in this site's own projects and posts, running on Workers AI.
- [Search](${BASE_URL}/en/search): Client-side search over everything listed here.
- [Source](https://github.com/cesargdm/cesargdm.com): This website's repository.
- [Sitemap](${BASE_URL}/sitemap.xml): Every URL, both locales, with hreflang pairs.
`

	return new Response(body, {
		headers: { 'content-type': 'text/plain; charset=utf-8' },
	})
}
