import { notFound } from 'next/navigation'

import { getProject } from '@/lib/projects'
import AsideAboutMe from '@/modules/AsideAboutMe'

type Params = {
	slug: 'string'
}

export async function generateMetadata({ params }: { params: Params }) {
	const post = await getProject('es', params.slug)

	return {
		title: `${post?.data.title} - Projects`,
		keywords: post?.data.keywords,
		description: post?.data.description,
		['og:title']: `${post?.data.title} - Projects`,
		['og:description']: post?.data.description,
		['og:image']: post?.data.image,
		['og:type']: 'article',
	}
}

export default async function BlogPostPage({ params }: { params: Params }) {
	const post = await getProject('es', params.slug)

	if (!post) {
		return notFound()
	}

	return (
		<>
			<article dangerouslySetInnerHTML={{ __html: post?.contentHtml ?? '' }} />
			<AsideAboutMe />
		</>
	)
}
