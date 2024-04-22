import { DynamicContextProvider, DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { createConfig, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { Shield3Provider } from '@shield3/react-sdk'
import Signer from './Signer'

const config = createConfig({
    chains: [mainnet],
    multiInjectedProviderDiscovery: false,
    transports: {
        [mainnet.id]: http(),
    },
})

const queryClient = new QueryClient()

export default function App() {
    return (
        <Shield3Provider apiKey={process.env.REACT_APP_SHIELD3_API_KEY} chainId={mainnet.id}>
            <DynamicContextProvider
                settings={{
                    environmentId: process.env.REACT_APP_DYNAMIC_PROJECT_ID,
                    walletConnectors: [EthereumWalletConnectors],
                }}
            >
                <WagmiProvider config={config}>
                    <QueryClientProvider client={queryClient}>
                        <DynamicWagmiConnector>
                            <DynamicWidget />
                            <Signer />
                        </DynamicWagmiConnector>
                    </QueryClientProvider>
                </WagmiProvider>
            </DynamicContextProvider>
        </Shield3Provider>
    )
}
