import type { Nft } from '@/lib/open-sea'

export default function NftInfo(props: Nft) {
	return (
		<div>
			<h1>{props.name}</h1>
			<p>{props.description}</p>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img src={props.image_url} alt={props.name} />
		</div>
	)
}
