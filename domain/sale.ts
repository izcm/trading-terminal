// todo: mappers dto => domain
import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
import type { Listing } from './listing'

import type { Hex } from './shared/types/eth'

export const saleKey = (chainId: number, orderHash: string) => `${chainId}:${orderHash}` as const

// todo: use bigints !
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
