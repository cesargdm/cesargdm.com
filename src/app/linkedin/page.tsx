import { redirect } from 'next/navigation'

import social from '@/lib/social.json'

export default function LinkedIn() {
	redirect(social.linkedin.url)
}
