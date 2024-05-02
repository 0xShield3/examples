"use client"
import { Shield3Provider } from "@shield3/react-sdk";
import { DynamicWidget } from "../lib/dynamic";
import Signer from "./Signer";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
      <Shield3Provider apiKey={process.env.NEXT_PUBLIC_SHIELD3_API_KEY as string} chainId={1}>
        <div className="flex flex-col items-center">
        <DynamicWidget />
        <Signer/>
        </div>
      </Shield3Provider>
      </div>
    </main>
  );
}
