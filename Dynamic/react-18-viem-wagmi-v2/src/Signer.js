"use client"
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import {useShield3Context} from "@shield3/react-sdk"
// import type { RoutingDecision } from '@shield3/react-sdk/dist/shield3/simulate'
import React, { useState } from 'react'

// interface Transaction {
//     to: string;
//     data?: string;
//     nonce: number;
//     value: number;
//     chainId: number;
//     gasLimit: number;
//     [key: string]: unknown; // Allows any number of other unknown keys
// }


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
    const [hovered1, setHovered1] = useState(false);
    const [hovered2, setHovered2] = useState(false);

    const buttonStyle1 = {
        backgroundColor: hovered1 ? 'blue' : 'white',
        color: hovered1 ? 'white' : 'black',
        padding: '1.25rem',
        margin: '0.5rem',
        borderRadius: '0.5rem',
        transition: 'background-color 700ms ease'
    };
    const buttonStyle2 = {
        backgroundColor: hovered2 ? 'blue' : 'white',
        color: hovered2 ? 'white' : 'black',
        padding: '1.25rem',
        margin: '0.5rem',
        borderRadius: '0.5rem',
        transition: 'background-color 700ms ease'
    };

    const sign = async (isBlocked) => {
        setResult("Getting Results...")
        const connectedAccounts = await primaryWallet?.connector.getConnectedAccounts() ?? []
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
        const results = await shield3Client.getPolicyResults(transaction, account)
        setResult(results?.decision ?? null)
    }

    return (
        <div style={{
            border: '1px solid white',
            borderRadius: '0.5rem',
            padding: '5rem',
            backgroundColor: 'black',
            display: 'flex',
            flexDirection: 'column',
            margin: '0.5rem'
        }}>
        <h1 style={{ margin: '0.5rem', color: 'white' }}>Get Policy Results</h1>
        <h2 style={{ margin: '0.5rem', color: 'white' }}>Result: {result}</h2>
        <button
                style={buttonStyle1}
                onMouseEnter={() => setHovered1(true)}
                onMouseLeave={() => setHovered1(false)}
                type="button"
                onClick={() => sign(true)}
            >Try flagged transaction</button>

        <button
            style={buttonStyle2}
            onMouseEnter={() => setHovered2(true)}
            onMouseLeave={() => setHovered2(false)}
            type="button"
            onClick={() => sign(false)}
        >Try allowed transaction</button>
        </div>
    )
}

export default Signer
