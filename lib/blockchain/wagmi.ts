import { Address } from 'viem'
import { createConfig, http } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import supportedChains from '@/chains.json'

type ChainExtras = wagmiChains.Chain & { marketplace: Address; weth: Address }

const configuredChains: ChainExtras[] = supportedChains.map(sc => {
  return {
    ...Object.values(wagmiChains).find(wc => wc.id === sc.chainId)!,
    marketplace: sc.marketplace as Address,
    weth: sc.weth as Address,
  }
})

if (configuredChains.length === 0) throw new Error('no supported chains configured')

const transports = Object.fromEntries(supportedChains.map(sc => [sc.chainId, http(sc.url)]))

export const wagmiConfig = createConfig({
  chains: configuredChains as unknown as [wagmiChains.Chain, ...wagmiChains.Chain[]],

  connectors: [injected()],
  transports,
})

export function getChainConfig(chainId: number) {
  return wagmiConfig.chains.find(c => c.id === chainId)
}
