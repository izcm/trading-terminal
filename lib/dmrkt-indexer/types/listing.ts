import type { Hex } from '@/domain/shared/types/eth'
import type { Order } from '@/protocol/eip712'
import type { NFTCollection } from './nft-collection'
import { NFT } from '@/domain/nft'

export type Listing = {
  id: string

  chainId: number
  orderHash: Hex

  type: 'ask' | 'bid'
  isCollectionBid: boolean

  collection: Hex
  tokenId: string

  price: string
  currency: Hex

  actor: Hex

  start: number // unix ms
  end: number // unix ms

  nftCollection?: NFTCollection | null
  nft?: NFT | null

  // raw order for contract interaction
  rawOrder: Order

  status: string
}
