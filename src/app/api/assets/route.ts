import { NextResponse } from 'next/server'

import { getPosts } from '@/lib/blog'
import { getProjects } from '@/lib/projects'

export function GET() {
	const language = undefined

	const projects = getProjects(language, { content: false })
	const posts = getPosts(language)

	return NextResponse.json({ projects, posts })
}
