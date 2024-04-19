import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  DynamicContextProvider,
  EthereumWalletConnectors,
  DynamicWagmiConnector,
  EthersExtension,
} from "@/lib/dynamic";

import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <DynamicContextProvider
        settings={{
          environmentId: "2762a57b-faa4-41ce-9f16-abff9300e2c9",
          walletConnectors: [EthereumWalletConnectors],
          walletConnectorExtensions: [EthersExtension],
        }}
      >
        <Providers>
          <DynamicWagmiConnector>
            <body className={inter.className}>{children}</body>
          </DynamicWagmiConnector>
        </Providers>
      </DynamicContextProvider>
    </html>
  );
}
