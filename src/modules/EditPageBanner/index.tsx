import { editFunctionality } from './styles.css'

export default function EditPageBanner({
	type,
	lang,
	slug,
}: {
	type: 'posts' | 'projects'
	lang: string
	slug: string
}) {
	return (
		<div className={editFunctionality}>
			<a
				href={`https://github.com/cesargdm/cesargdm.com/edit/main/src/assets/${type}/${lang}/${slug}.md`}
			>
				Edit on GitHub
			</a>
		</div>
	)
}
