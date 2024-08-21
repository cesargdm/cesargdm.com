import { vars } from '@/app/theme.css'

import { dropdownContent, dropdownText } from './styles.css'

const companiesMetadata = {
	OCHO: {
		url: 'https://ocho.co',
		field: 'Insurance Tech',
		description:
			'Car insurance with $0 down payment and credit-building benefits. Partnered with top insurers to provide a fair start to all drivers.',
	},
	Aura: {
		url: 'https://myaura.com',
		field: 'Fintech',
		description:
			'Provided loans for underbanked communities (out of business).',
		outOfBusiness: true,
	},
	Tesorio: {
		url: 'https://tesorio.com',
		field: 'Business Intelligence',
		description: `Automates A/R processes, improves cash flow predictability, and integrates with popular ERP and CRM tools.`,
	},
	Covalto: {
		url: 'https://covalto.com',
		field: 'Fintech',
		description:
			'Future-oriented bank for businesses, offering fast, smart, flexible, and comprehensive financial solutions.',
	},
	IBM: {
		url: 'https://ibm.com',
		field: 'Technology',
		description:
			'Global technology company providing hardware, software, and IT services.',
	},
	Cretia: {
		url: 'https://about.cretia.app',
		field: 'Business Intelligence',
		description:
			'ERP platform for mexican SME. Offers intelligent billing, invoicing, expense tracking and more.',
	},
} as Record<
	string,
	{ url: string; field: string; description: string; outOfBusiness?: boolean }
>

export default function HoverCompany({ children }: { children: string }) {
	const metadata = companiesMetadata[children]

	return (
		<span style={{ position: 'relative', display: 'inline' }}>
			<a href={metadata.url} className={dropdownText}>
				{children}
				{Boolean(metadata.outOfBusiness) && (
					<span
						style={{
							color: vars.colors.text.secondary,
							fontSize: vars.fontSize.small,
						}}
					>
						†
					</span>
				)}
			</a>
			<span style={{ display: 'none' }} className={dropdownContent} aria-hidden>
				<span style={{ gap: 15, display: 'flex', flexDirection: 'column' }}>
					<span
						style={{
							color: vars.colors.text.secondary,
							fontSize: vars.fontSize.small,
						}}
					>
						{metadata.field}
					</span>

					<span>{metadata.description}</span>
				</span>
			</span>
		</span>
	)
}
