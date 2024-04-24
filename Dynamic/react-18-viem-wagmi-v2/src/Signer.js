import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useShield3Context } from '@shield3/react-sdk'
import { useState } from 'react'

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

    const [result, setResult] = useState(null)

    const sign = async (isBlocked) => {
        const connectedAccounts = await primaryWallet.connector.getConnectedAccounts()
        const account = connectedAccounts[0]

        let transaction
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
        console.log(shield3Client)
        const results = await shield3Client.getPolicyResults(transaction, account)
        setResult(results.decision)
    }

    return (
        <div>
            <h1>Get Policy Results</h1>
            <h2>Result: {result}</h2>
            <button type='button' onClick={() => sign(true)}>Try flagged transaction</button>
            <button type='button' onClick={() => sign(false)}>Try allowed transaction</button>
        </div>
    )
}

export default Signer
