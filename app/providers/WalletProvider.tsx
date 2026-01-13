'use client'

import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit'
import { config } from '@/blockchain/config/wagmi'
import '@rainbow-me/rainbowkit/styles.css'

const CYBER_VOID = {
  accent: '#6d75ff',
  accentForeground: 'rgba(21, 31, 73, 0.94)',
}

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
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
