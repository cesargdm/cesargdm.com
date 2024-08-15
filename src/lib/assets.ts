export function getAssets(): Promise<{
	projects: { slug: string; data: { title: string; description: string } }[]
	posts: { slug: string; data: Record<string, string> }[]
}> {
	return fetch('https://cesargdm.com/api/assets')
		.then((res) => res.json())
		.catch(() => undefined)
}
