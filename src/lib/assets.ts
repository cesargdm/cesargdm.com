import { BASE_URL } from '@/lib/constants'

export function getAssets(): Promise<{
	projects: { slug: string; data: { title: string; description: string } }[]
	posts: { slug: string; data: Record<string, string> }[]
}> {
	return fetch(`${BASE_URL}/api/assets`)
		.then((res) => res.json())
		.catch(() => undefined)
}
