import { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
import { Listing } from '@/lib/dmrkt-indexer/types/listing'

import type { Hex } from './shared/eth'

export const saleKey = (chainId: number, orderHash: string) => `${chainId}:${orderHash}` as const

export type Sale = {
  id: string
  chainId: number

  orderHash: Hex
  txHash: Hex

  // NFT details
  collection: Hex
  tokenId: string

  // Trade participants
  seller: Hex
  buyer: Hex

  // Payment
  currency: Hex
  price: string

  // Block/timing info
  blockNumber: number
  timestamp: number

  // Transaction details
  logIndex: number

  nftCollection?: NFTCollection | null
  listing?: Listing | null
}
