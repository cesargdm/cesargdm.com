import { notFound } from 'next/navigation'

import AsideAboutMe from '@/modules/AsideAboutMe'

import { getPost } from '@/lib/blog'

import { Merriweather } from 'next/font/google'

const merriweather = Merriweather({ weight: '400', subsets: ['latin'] })

export default async function BlogPostPage({
	params,
}: {
	params: { slug: string }
}) {
	const post = await getPost('es', params.slug)

	if (!post) {
		return notFound()
	}

	return (
		<>
			<article
				className={merriweather.className}
				dangerouslySetInnerHTML={{ __html: post?.contentHtml ?? '' }}
			/>
			<AsideAboutMe />
		</>
	)
}
