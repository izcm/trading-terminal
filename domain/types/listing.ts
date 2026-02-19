import { Order } from '@/features/orderbook/web3/types/order'
import { NFTCollection } from './nft-collection'

export type Listing = {
  id: string

  type: 'ask' | 'bid'

  collectionAddress: string
  tokenId: string

  price: string
  currency: string

  actor: string

  start: number // unix ms
  end: number // unix ms

  collectionData?: NFTCollection | null

  // raw order for contract interaction
  rawOrder: Order
}
