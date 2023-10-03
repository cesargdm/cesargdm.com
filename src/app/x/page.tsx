import { redirect } from 'next/navigation'

import social from '@/lib/social.json'

export default function X() {
	redirect(social.x.url)
}
