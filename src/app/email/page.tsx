import { redirect } from 'next/navigation'

import social from '@/lib/social.json'

export default function Mail() {
	redirect(social.email.url)
}
