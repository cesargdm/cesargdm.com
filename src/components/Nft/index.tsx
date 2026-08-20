import type { Nft } from '@/lib/open-sea'

export default function NftInfo(props: Nft) {
	return (
		<div>
			<h1>{props.name}</h1>
			<p>{props.description}</p>
			<img src={props.image_url} alt={props.name} width={500} height={500} />
		</div>
	)
}
