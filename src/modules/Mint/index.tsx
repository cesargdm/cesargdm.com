'use client'

import { IconArtboard } from '@tabler/icons-react'
import { getDefaultProvider } from 'ethers'
import {
	WagmiConfig,
	createClient,
	useAccount,
	useConnect,
	useDisconnect,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

const client = createClient({
	autoConnect: true,
	provider: getDefaultProvider(),
})

function ConnectWallet() {
	const { address, isConnected } = useAccount()
	const { connect } = useConnect({
		connector: new InjectedConnector(),
	})
	const { disconnect } = useDisconnect()

	if (isConnected) {
		return (
			<div>
				Connected to {address}
				<button onClick={() => disconnect()}>Disconnect</button>
				<button>Mint your Proof of Visit</button>
			</div>
		)
	}

	return <button onClick={() => connect()}>Connect Wallet</button>
}

function Mint() {
	return (
		<>
			<WagmiConfig client={client}>
				<h2>
					<IconArtboard />
					Mint
				</h2>
				<ConnectWallet />
			</WagmiConfig>
		</>
	)
}

export default Mint
