import fs from 'node:fs'
import { Address } from 'viem'

export type ChainConfig = {
  chainId: number
  rpcUrl: string
  marketplaceAddr: Address
  wethAddr: Address
}

// export function loadChainsConfig(): ChainConfig[] {}
