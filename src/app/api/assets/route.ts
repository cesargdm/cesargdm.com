import { NextResponse } from 'next/server'

import { getPosts } from '@/lib/blog'
import { getProjects } from '@/lib/projects'

export async function GET() {
	const [projects, posts] = await Promise.all([
		getProjects(undefined, { content: false }),
		getPosts(),
	])

	return NextResponse.json({ projects, posts })
}
