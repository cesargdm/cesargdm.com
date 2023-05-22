import { NextResponse } from 'next/server'

import { getProjects } from '@/lib/projects'
import { getPosts } from '@/lib/blog'

export async function GET(request: Request) {
	const [projects, posts] = await Promise.all([
		getProjects(undefined, { content: false }),
		getPosts(),
	])

	return NextResponse.json({ projects, posts })
}
