import classNames from 'classnames'
import { Merriweather } from 'next/font/google'
import { notFound } from 'next/navigation'

import AsideAboutMe from '@/modules/AsideAboutMe'
import EditPageBanner from '@/modules/EditPageBanner'

import PageAnalytics from '@/components/PageAnalytics'

import { getPost } from '@/lib/blog'
import { getMetadata } from '@/lib/metadata'
import type { PageProps } from '@/lib/types'

import { articleContainer, nonTechnicalEntry } from './styles.css'

const merriweather = Merriweather({
	subsets: ['latin'],
	fallback: ['serif'],
	weight: ['400', '900'],
	variable: '--fonts--merriweather',
})

type Params = {
	slug: string
}

export async function generateMetadata({ params }: { params: Params }) {
	const post = await getPost('en', params.slug)

	return getMetadata({
		type: 'article',
		description: post?.data.extract as string,
		title: `${post?.data.title} - Blog`,
		alternates: { canonical: `/blog/${post?.slug}` },
	})
}

export default async function BlogPostPage({
	params,
}: PageProps<{
	params: { slug: string }
}>) {
	const post = await getPost(params.locale, params.slug)

	if (!post) {
		return notFound()
	}

	return (
		<>
			<PageAnalytics locale={params.locale} objectId={`post-${params.slug}`} />
			<div>
				<article
					dangerouslySetInnerHTML={{ __html: post?.contentHtml ?? '' }}
					className={classNames(articleContainer, {
						[nonTechnicalEntry]: !post.data.technical,
						[merriweather.className]: !post.data.technical,
					})}
				/>
				<EditPageBanner type="posts" lang="en" slug={params.slug} />

				<hr />

				<div className="giscus" />
			</div>
			<AsideAboutMe />
		</>
	)
}
