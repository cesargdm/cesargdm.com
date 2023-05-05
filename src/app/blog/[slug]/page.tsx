import { notFound } from 'next/navigation'

import AsideAboutMe from '@/modules/AsideAboutMe'

import { getPost } from '@/lib/blog'

import { Merriweather } from 'next/font/google'

const merriweather = Merriweather({
	weight: ['400', '900'],
	subsets: ['latin'],
	variable: '--fonts--merriweather',
	fallback: ['serif'],
})

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
			<article
				className={merriweather.className}
				dangerouslySetInnerHTML={{ __html: post?.contentHtml ?? '' }}
			/>
			<AsideAboutMe />
		</>
	)
}
