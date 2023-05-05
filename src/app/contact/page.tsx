import {
	IconBrandGithub,
	IconBrandLinkedin,
	IconBrandTwitter,
	IconFile,
	IconMail,
} from '@tabler/icons-react'
import { contactList } from './styles.css'
import { vars } from '../theme.css'

export const metadata = {
	title: 'Contact',
}

export default function Contact() {
	return (
		<div>
			<h1
				style={{
					textAlign: 'center',
					width: '100%',
					display: 'block',
					marginBottom: vars.space.xlarge,
				}}
			>
				Contact
			</h1>
			<ul className={contactList}>
				<li>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://twitter.com/cesargdm"
					>
						<IconBrandTwitter aria-hidden />
						Twitter
					</a>
				</li>
				<li>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://read.cv/cesargdm"
					>
						<IconFile aria-hidden />
						CV
					</a>
				</li>
				<li>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://github.com/cesargdm"
					>
						<IconBrandGithub aria-hidden />
						GitHub
					</a>
				</li>
				<li>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://linkedin.com/in/cesargdm"
					>
						<IconBrandLinkedin aria-hidden />
						LinkedIn
					</a>
				</li>
				<li>
					<a href="mailto:yo@cesargdm.com">
						<IconMail aria-hidden />
						Email
					</a>
				</li>
			</ul>
		</div>
	)
}
