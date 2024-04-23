import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import {useShield3Context} from "@shield3/react-sdk"
import type { RoutingDecision } from '@shield3/react-sdk/dist/shield3/simulate'
import { useState } from 'react'

interface Transaction {
    to: string;
    data?: string;
    nonce: number;
    value: number;
    chainId: number;
    gasLimit: number;
    [key: string]: unknown; // Allows any number of other unknown keys
}


const exampleFlaggedTx = {
    to: '0x6aabdd49a7f97f5242fd0fd6938987e039827666',
    data: '0xa9059cbb0000000000000000000000006aabdd49a7f97f5242fd0fd6938987e03982766600000000000000000000000000000000000000000000000001e32b4789740000',
    nonce: 1,
    value: 0,
    chainId: 1,
    gasLimit: 100000,
}

const Signer = () => {
    const { primaryWallet } = useDynamicContext()
    const { shield3Client } = useShield3Context()

    const [result, setResult] = useState<RoutingDecision | null>(null)

    const sign = async (isBlocked: boolean) => {
        const connectedAccounts = await primaryWallet?.connector.getConnectedAccounts() ?? []
        const account = connectedAccounts[0]

        let transaction : Transaction
        if (isBlocked) transaction = exampleFlaggedTx
        else
            transaction = {
                to: account,
                nonce: 1,
                value: 0,
                chainId: 1,
                gasLimit: 100000,
            }

        console.log({ transaction, account })
        const results = await shield3Client.getPolicyResults(transaction, account as `0x${string}`)
        setResult(results?.decision ?? null)
    }

    return (
        <div>
            <h1>Get Policy Results</h1>
            <h2>Result: {result}</h2>
            <button type="button" onClick={() => sign(true)}>Try flagged transaction</button>
            <button type="button" onClick={() => sign(false)}>Try allowed transaction</button>
        </div>
    )
}

export default Signer
