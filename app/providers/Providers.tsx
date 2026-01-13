'use client'

import dynamic from 'next/dynamic'

import { WagmiProvider } from 'wagmi'
import { config } from '@/blockchain/config/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const WalletProvider = dynamic(() => import('./WalletProvider'), {
  ssr: false,
})

const CYBER_VOID = {
  accent: '#6d75ff',
  accentForeground: 'rgba(21, 31, 73, 0.94)',
  borderDefault: 'rgba(130, 150, 255, 0.35)',
  borderSoft: 'rgba(130, 150, 255, 0.18)',
  accentWeak: 'rgba(109, 117, 255, 0.24)',
}

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>{children}</WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
