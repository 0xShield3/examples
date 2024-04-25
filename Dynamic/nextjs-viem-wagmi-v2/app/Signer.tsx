"use client"
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import {useShield3Context} from "@shield3/react-sdk"
import type { RoutingDecision } from '@shield3/react-sdk/dist/shield3/simulate'
import React, { useState } from 'react'


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

    const [result, setResult] = useState<RoutingDecision| string | null>(null)
    const [response, setResponse] = useState("")

    const sign = async (isBlocked:boolean) => {
        setResult("Getting Results...")
        const connectedAccounts = await primaryWallet?.connector.getConnectedAccounts() ?? []
        const account = connectedAccounts[0]
        let transaction:Transaction
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
        setResponse(JSON.stringify(results,null,2))
    }

    return (
        <div className='border border-white rounded-lg p-20 bg-black flex flex-col m-2'>
            <h1 className='m-2 text-white'>Get Policy Results</h1>
            <h2 className='m-2 text-white'>Result: {result}</h2>
            <button className="bg-white text-black p-5 m-2 rounded-lg transition duration-700 hover:bg-purple-500" type="button" onClick={() => sign(true)}>Try flagged transaction</button>
            <button className="bg-white text-black p-5 m-2 rounded-lg transition duration-700 hover:bg-purple-500" type="button" onClick={() => sign(false)}>Try allowed transaction</button>
            <div style={{ backgroundColor: '#282c34', padding: '20px', borderRadius: '8px', color: 'lightgreen' , width:'500px',height: '300px',overflow: 'auto'}}>
            <pre style={{
                whiteSpace: 'pre-wrap',       // Maintains whitespace
                wordWrap: 'break-word',       // Prevents long text from overflowing
                overflow: 'auto',
                borderRadius: '8px'              // Ensures scrollability within the pre tag
                }}>
                    <code>
                        {response}
                    </code>
                </pre>
            </div>
        </div>
    )
}

export default Signer
