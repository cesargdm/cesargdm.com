import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	_request: NextApiRequest,
	response: NextApiResponse<unknown>,
) {
	const userId = '313716452'

	const data = await fetch(`https://api.twitter.com/2/users/${userId}/tweets`, {
		headers: {
			Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
		},
	}).then((response) => response.json())

	response.status(200).json(data)
}
