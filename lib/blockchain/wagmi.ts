import { Address } from 'viem'
import { createConfig, http } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import supportedChains from '@/chains.json'

// if demo mode -> only include anvil
const activeChains =
  process.env.NEXT_PUBLIC_MODE === 'DEMO'
    ? supportedChains.filter(c => c.chainId === 31337)
    : // : supportedChains.filter(c => c.chainId !== 31337)
      supportedChains

type ChainExtras = wagmiChains.Chain & { marketplace: Address; weth: Address }

// anvil's marketplace address changes per-deploy (redeployed contracts)
// to avoid any ambiguity any use of anvil has to set the marketplace address
// as NEXT_PUBLIC env variable
if (activeChains.some(sc => sc.chainId === 31337) && !process.env.NEXT_PUBLIC_ANVIL_MARKETPLACE) {
  throw new Error('NEXT_PUBLIC_ANVIL_MARKETPLACE must be set when anvil is a configured chain')
}

const configuredChains: ChainExtras[] = activeChains.map(sc => {
  const isAnvil = sc.chainId === 31337
  return {
    ...Object.values(wagmiChains).find(wc => wc.id === sc.chainId)!,
    marketplace: (isAnvil ? process.env.NEXT_PUBLIC_ANVIL_MARKETPLACE! : sc.marketplace) as Address,
    weth: sc.weth as Address,
  }
})

if (configuredChains.length === 0) throw new Error('no supported chains configured')

const transports = Object.fromEntries(activeChains.map(sc => [sc.chainId, http(sc.url)]))

export const wagmiConfig = createConfig({
  chains: configuredChains as unknown as [ChainExtras, ...ChainExtras[]],

  connectors: [injected()],
  transports: transports as Record<
    (typeof configuredChains)[number]['id'],
    ReturnType<typeof http>
  >,
})

export function getChainConfig(chainId: number) {
  return wagmiConfig.chains.find(c => c.id === chainId)
}

export function getTxExplorerUrl(chainId: number, hash: string) {
  const baseUrl = getChainConfig(chainId)?.blockExplorers?.default?.url
  return baseUrl ? `${baseUrl}/tx/${hash}` : undefined
}
