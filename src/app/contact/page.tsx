import {
	IconFile,
	IconMail,
	IconBrandGithub,
	IconBrandTwitter,
	IconBrandLinkedin,
} from '@tabler/icons-react'

import { contactHeading, contactList } from './styles.css'

export const metadata = {
	title: 'Contact',
	// openGraph: {
	// 	title: 'Contact',
	// 	description: 'César Guadarrama Cantú - Product engineer - Contact',
	// },
}

const socialLinks = [
	{
		name: 'Twitter',
		url: 'https://twitter.com/cesargdm',
		icon: <IconBrandTwitter aria-hidden />,
	},
	{
		name: 'CV',
		url: 'https://read.cv/cesargdm',
		icon: <IconFile aria-hidden />,
	},
	{
		name: 'GitHub',
		url: 'https://github.com/cesargdm',
		icon: <IconBrandGithub aria-hidden />,
	},
	{
		name: 'LinkedIn',
		url: 'https://linkedin.com/in/cesargdm',
		icon: <IconBrandLinkedin aria-hidden />,
	},
	{
		name: 'Email',
		url: 'mailto:yo@cesargdm.com',
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
