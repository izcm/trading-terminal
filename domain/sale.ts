import type { NFTCollection } from './nft-collection'
import type { Listing } from './listing'

import type { Hex } from './shared/eth'

export const saleKey = (chainId: number, orderHash: string) => `${chainId}:${orderHash}` as const

export type Sale = {
  id: string
  chainId: number

  orderHash: Hex
  txHash: Hex

  // NFT details
  collection: Hex
  tokenId: bigint

  // Trade participants
  seller: Hex
  buyer: Hex

  // Payment
  currency: Hex
  price: bigint

  // Block/timing info
  blockNumber: number
  timestamp: number

  // Transaction details
  logIndex: number

  nftCollection?: NFTCollection | null
  order?: Listing | null
}
