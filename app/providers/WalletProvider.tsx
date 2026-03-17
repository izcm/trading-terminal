'use client'

import { wagmiConfig } from '@/lib/blockchain/wagmi'
import { midnightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiProvider } from 'wagmi'

const CYBER_VOID = {
  accent: '#6d75ff',
  accentForeground: 'rgba(21, 31, 73, 0.94)',
}

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider
        theme={midnightTheme({
          accentColor: CYBER_VOID.accent,
          accentColorForeground: CYBER_VOID.accentForeground,
        })}
      >
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  )
}
