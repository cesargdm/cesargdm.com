import { notFound } from 'next/navigation'

import { getProject } from '@/lib/projects'
import EditPageBanner from '@/modules/EditPageBanner'

type Params = {
	slug: 'string'
}

export async function generateMetadata({ params }: { params: Params }) {
	const post = await getProject('en', params.slug)

	return {
		title: `${post?.data.title} - Projects`,
		keywords: post?.data.keywords,
		description: post?.data.description,
		openGraph: {
			title: `${post?.data.title} - Projects`,
			description: post?.data.description,
		},
	}
}

export default async function BlogPostPage({ params }: { params: Params }) {
	const post = await getProject('en', params.slug)

	if (!post) {
		return notFound()
	}

	return (
		<>
			<article dangerouslySetInnerHTML={{ __html: post?.contentHtml ?? '' }} />
			<EditPageBanner type="projects" lang="en" slug={params.slug} />
		</>
	)
}
