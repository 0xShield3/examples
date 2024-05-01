"use client"
import {useWallets, usePrivy} from '@privy-io/react-auth';
import {useShield3Context} from "@shield3/react-sdk"
import type { RoutingDecision } from '@shield3/react-sdk/dist/shield3/simulate'
import React, { useState, useEffect } from 'react'
import type { WalletWithMetadata } from '@privy-io/react-auth';
import { useRouter } from "next/router";
import { type WalletClient, createWalletClient, custom } from 'viem'
import { sepolia } from 'viem/chains'



interface Transaction {
    to: string;
    data?: string;
    nonce?: number;
    value: number;
    chainId: number;
    gasLimit: number;
    [key: string]: unknown; // Allows any number of other unknown keys
}


const exampleFlaggedTx = {
    to: '0x6aabdd49a7f97f5242fd0fd6938987e039827666',
    data: '0xa9059cbb0000000000000000000000006aabdd49a7f97f5242fd0fd6938987e03982766600000000000000000000000000000000000000000000000001e32b4789740000',
    value: 0,
    chainId: 1,
    gasLimit: 100000,
}


const Signer = () => {
    const {user, sendTransaction, ready, authenticated }=usePrivy()
    const [receiptUrl,setReceiptUrl]=useState<string|null>(null)
    let receipt=null
    let client:null|WalletClient=null
    const router = useRouter();
    useEffect(() => {
        if (!ready || !authenticated) router.push("/");
      }, [ready, authenticated, router.push]);
    const {wallets: connectedWallets} = useWallets();
    const linkedAccounts = user?.linkedAccounts || [];
    const wallets = linkedAccounts.filter((a) => a.type === 'wallet') as WalletWithMetadata[];
  
    const linkedAndConnectedWallets = wallets
      .filter((w) => connectedWallets.some((cw) => cw.address === w.address))
      .sort((a, b) => b.firstVerifiedAt.toLocaleString().localeCompare(a.firstVerifiedAt.toLocaleString()));

    const account=linkedAndConnectedWallets[0]?.address as `0x${string}`


    const { shield3Client } = useShield3Context()

    const [result, setResult] = useState<RoutingDecision| string | null>(null)
    const [response, setResponse] = useState("")
    const uiConfig = {
        header: 'Send ETH (sepolia)',
        description: 'Send a protected transaction',
        buttonText: 'Submit'
      };

    const sign = async (isBlocked:boolean) => {
        setResult("Getting Results...")
        let transaction:Transaction
        if (isBlocked) transaction = exampleFlaggedTx
        else
            transaction = {
                to: account,
                value: 0,
                chainId: 11155111,
                gasLimit: 100000,
            }

        console.log({ transaction, account })
        const results = await shield3Client.getPolicyResults(transaction, account )
        const decision =results?.decision ?? null
        setResult(decision)
        setResponse(JSON.stringify(results,null,2))
        
        if (decision==='Allow'){
            try {
                if (user?.wallet?.walletClientType==='privy') {
                    receipt=(await sendTransaction(transaction, uiConfig)).transactionHash as `0x${string}`}
                else {
                    client=client ? 
                        client : 
                        createWalletClient({ 
                            account:account as `0x${string}`,
                            chain: sepolia,
                            transport: custom(window.ethereum)
                        })
                    const prepped_tx=await client.prepareTransactionRequest(transaction)
                    console.log(prepped_tx)
                    receipt=await client.sendTransaction(prepped_tx)
                }
                setReceiptUrl(`https://sepolia.etherscan.io/tx/${receipt}`)
            }    
            catch (error){console.log(error)}
        }
    }
    return (
        <div className='flex flex-col gap-2'>
            <div className='flex flex-col items-center gap-2'>
            <button className="button px-4 w-full h-10" type="button" onClick={() => sign(true)}>Try flagged transaction</button>
            <button className="button px-4 w-full h-10" type="button" onClick={() => sign(false)}>Try allowed transaction</button>
            </div>
            {result && (<div className='transform-all duration-1000 flex flex-col w-full border border-privy-3 h-auto rounded-xl items-center text-center'>
            <h2 className='mt-2 text-privy-color-foreground-3 text-xs'>Policy Result</h2>
            <h2 className='w-full text-privy-color-foreground-1 text-2xl'>{result}</h2>
            {receiptUrl && (
                <a className="m-2" href={receiptUrl} target="_blank" rel="noopener noreferrer">View Transaction</a>
            )}
            </div>)}

            <div className="p-2 transform-all duration-1000 bg-privy-color-background-2 h-32 hover:h-96 font-mono text-xs text-privy-color-foreground-2 no-scrollbar overflow-auto rounded-xl">
            <pre style={{
                whiteSpace: 'pre-wrap',     
                wordWrap: 'break-word',     
                overflow: 'auto',
                borderRadius: '8px'         
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
