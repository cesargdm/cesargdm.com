import { IconChevronLeft } from '@tabler/icons-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import EditPageBanner from '@/modules/EditPageBanner'

import PageAnalytics from '@/components/PageAnalytics'

import { getMetadata } from '@/lib/metadata'
import { getProject } from '@/lib/projects'
import type { PageProps } from '@/lib/types'

type Params = {
	slug: 'string'
}

export const generateMetadata = getMetadata(
	async ({ params }: PageProps<{ params: Params }>) => {
		const post = await getProject(params.locale, params.slug)

		if (!post) return notFound()

		return {
			keywords: post?.data.keywords as string,
			description: post?.data.description as string,
			title: `${post?.data.title} - Projects`,
			alternates: { canonical: `/${params.locale}/projects/${post?.slug}` },
		}
	},
)

export default async function BlogPostPage({
	params,
}: PageProps<{ params: Params }>) {
	const post = await getProject(params.locale, params.slug)

	if (!post) {
		return notFound()
	}

	return (
		<>
			<Link
				href={`/${params.locale}/projects`}
				style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}
			>
				<IconChevronLeft />
				Projects
			</Link>
			<PageAnalytics
				locale={params.locale}
				objectId={`project-${params.slug}`}
			/>
			<article dangerouslySetInnerHTML={{ __html: post?.contentHtml ?? '' }} />
			<EditPageBanner type="projects" lang="en" slug={params.slug} />
		</>
	)
}
