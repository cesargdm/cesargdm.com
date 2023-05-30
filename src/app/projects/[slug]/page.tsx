import { notFound } from 'next/navigation'

import EditPageBanner from '@/modules/EditPageBanner'

import { getMetadata } from '@/lib/metadata'
import { getProject } from '@/lib/projects'

type Params = {
	slug: 'string'
}

export async function generateMetadata({ params }: { params: Params }) {
	const post = await getProject('en', params.slug)

	return getMetadata({
		keywords: post?.data.keywords,
		description: post?.data.description,
		title: `${post?.data.title} - Projects`,
		alternates: { canonical: `/projects/${post?.slug}` },
	})
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
