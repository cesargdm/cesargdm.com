/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IconBrandGithub, IconStar } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

import { getHumanReadableDate } from '@/lib/date'
import { getMetadata } from '@/lib/metadata'
import { getProjects } from '@/lib/projects'
import type { PageProps } from '@/lib/types'

import { vars } from '@/app/theme.css'

import {
	entriesList,
	entryDate,
	entryDescriptionContainer,
	entryItem,
	entryText,
	entryTitle,
	highlightedEntryItem,
	pageDescription,
	projectDescription,
	projectEntryLink,
	projectTechnologies,
	projectTechnologyItem,
} from '../blog/styles.css'

export const metadata = getMetadata(({ params }) => ({
	title: 'Projects',
	description:
		'Software engineering projects, websites, web apps, native apps for iOS and Android and more',
	alternates: { canonical: `/${params.locale}/projects` },
}))

export default function Blog({ params }: PageProps) {
	const entries = getProjects(params.locale)

	return (
		<>
			<h1>Projects</h1>
			<p className={pageDescription}>
				Here are some of the projects I've worked on. You can find more
				information for each one.
			</p>
			<ul className={entriesList}>
				{entries.map((entry) => (
					<li
						key={entry.slug}
						className={entry.data.highlight ? highlightedEntryItem : entryItem}
					>
						<Link
							style={{ backgroundColor: entry.data.highlight?.color as string }}
							className={projectEntryLink}
							href={`/${params.locale}/projects/${entry.slug}`}
						>
							{typeof entry.data.highlight === 'object' ? (
								<Image
									width={100}
									height={100}
									style={{ borderRadius: 20 }}
									src={entry.data.highlight.logoUrl as string}
									alt=""
								/>
							) : null}
							<div className={entryText}>
								<div className={entryDescriptionContainer}>
									<h2 className={entryTitle}>{entry.data.title}</h2>
									<p className={entryDate}>
										{getHumanReadableDate(entry.data.date as string)}
									</p>
								</div>
								<p className={projectDescription}>{entry.data.description}</p>
								{Array.isArray(entry.data.tags) && (
									<ul className={projectTechnologies}>
										{entry.data.tags.map((tech: string) => (
											<li className={projectTechnologyItem} key={tech}>
												{tech}
											</li>
										))}
									</ul>
								)}
							</div>
						</Link>

						{typeof entry.data === 'object' &&
						'repository' in entry.data &&
						typeof entry.data.repository === 'object' &&
						entry.data.repository ? (
							<div
								style={{
									position: 'absolute',
									bottom: 0,
									right: 0,
									padding: 16,
								}}
							>
								<a
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 2,
										backgroundColor: entry.data.repository.stars
											? 'gold'
											: vars.colors.background.gray,
										padding: '4px 8px',
										borderRadius: 16,
										color: '#333',
										textDecoration: 'none',
									}}
									href={entry.data.repository.url}
								>
									{entry.data.repository.stars ? (
										<span style={{ fontSize: '0.7rem' }}>
											{entry.data.repository.stars}
										</span>
									) : null}
									{entry.data.repository.stars ? (
										<IconStar size={12} />
									) : (
										<IconBrandGithub size={12} />
									)}
								</a>
							</div>
						) : null}
					</li>
				))}
			</ul>
		</>
	)
}
