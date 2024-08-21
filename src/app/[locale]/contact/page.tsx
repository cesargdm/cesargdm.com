import {
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandX,
	IconFile,
	IconMail,
} from '@tabler/icons-react'

import { getMetadata } from '@/lib/metadata'
import social from '@/lib/social.json'

import { contactHeading, contactList } from './styles.css'

export const metadata = getMetadata(({ params }) => ({
	title: 'Contact',
	description: 'Social links and contact information for César Guadarrama',
	alternates: { canonical: `/${params.locale}/contact` },
}))

const socialLinks = [
	{
		...social.x,
		icon: <IconBrandX aria-hidden />,
	},
	{
		...social.cv,
		icon: <IconFile aria-hidden />,
	},
	{
		...social.github,
		icon: <IconBrandGithub aria-hidden />,
	},
	{
		...social.linkedin,
		icon: <IconBrandLinkedin aria-hidden />,
	},
	{
		...social.email,
		icon: <IconMail aria-hidden />,
	},
]

function SocialItem(props: { name: string; url: string; icon: JSX.Element }) {
	return (
		<li>
			<a target="_blank" rel="noopener noreferrer" href={props.url}>
				{props.icon}
				{props.name}
			</a>
		</li>
	)
}

export default function Contact() {
	return (
		<>
			<h1 className={contactHeading}>Contact</h1>
			<ul className={contactList}>
				{socialLinks.map((link) => (
					<SocialItem key={link.name} {...link} />
				))}
			</ul>
		</>
	)
}
