import type { Order } from '@/protocol/eip712'
import type { Hex } from 'viem'
import type { NFTCollection } from './nft-collection'
export type ListingDTO = {
  id: string
  chainId: number

  type: 'ask' | 'bid'
  isCollectionBid: boolean

  collection: Hex
  tokenId: string

  price: string
  currency: Hex

  actor: Hex

  start: number // unix ms
  end: number // unix ms

  collectionMeta?: NFTCollection | null

  // raw order for contract interaction
  rawOrder: Order
}
