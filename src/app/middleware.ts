import { rewrite } from '@vercel/edge'

import social from '@/lib/social.json'

export default function middleware(request: Request) {
	const url = new URL(request.url)

	const subdomain = url.hostname.split('.')[0]

	const match = social[subdomain as keyof typeof social]

	if (match) {
		return rewrite(match.url)
	}
}
