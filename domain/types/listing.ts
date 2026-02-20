import { Hex } from 'viem'
import { Order } from '@/lib/blockchain/orderbook/types/order'
import { NFTCollection } from './nft-collection'

export type Listing = {
  id: string
  chainId: number

  type: 'ask' | 'bid'

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
