'use client'

import dynamic from 'next/dynamic'

import { wagmiConfig } from '@/lib/blockchain/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { TxProvider } from './TxProvider'

const WalletProvider = dynamic(() => import('./WalletProvider'), {
  ssr: false,
})
const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          <TxProvider>{children}</TxProvider>
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
