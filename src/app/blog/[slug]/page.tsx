import classNames from 'classnames'
import { notFound } from 'next/navigation'
import { Merriweather } from 'next/font/google'

import AsideAboutMe from '@/modules/AsideAboutMe'
import EditPageBanner from '@/modules/EditPageBanner'

import { getPost } from '@/lib/blog'
import { getMetadata, openGraph } from '@/lib/metadata'

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
		title: `${post?.data.title} - Blog`,
		description: post?.data.extract,
	})
}

export default async function BlogPostPage({
	params,
}: {
	params: { slug: string }
}) {
	const post = await getPost('en', params.slug)

	if (!post) {
		return notFound()
	}

	return (
		<>
			<div>
				<article
					className={classNames(articleContainer, {
						[nonTechnicalEntry]: !post.data.technical,
						[merriweather.className]: !post.data.technical,
					})}
					dangerouslySetInnerHTML={{ __html: post?.contentHtml ?? '' }}
				/>
				<EditPageBanner type="posts" lang="en" slug={params.slug} />
			</div>
			<AsideAboutMe />
		</>
	)
}
