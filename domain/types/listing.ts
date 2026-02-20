import { Hex } from 'viem'
import { Order } from '@/features/orderbook/web3/types/order'
import { NFTCollection } from './nft-collection'

export type Listing = {
  id: string
  chainId: number

  type: 'ask' | 'bid'

  collectionAddress: Hex
  tokenId: string

  price: string
  currency: Hex

  actor: Hex

  start: number // unix ms
  end: number // unix ms

  collectionData?: NFTCollection | null

  // raw order for contract interaction
  rawOrder: Order
}
