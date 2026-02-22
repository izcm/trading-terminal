import { Hex } from 'viem'
import { Order } from '@/lib/blockchain/orderbook/eip712/types'
import { NFTCollection } from './nft-collection'

export type Listing = {
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
