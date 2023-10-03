import { redirect } from 'next/navigation'

import social from '@/lib/social.json'

export default function GitHub() {
	redirect(social.github.url)
}
