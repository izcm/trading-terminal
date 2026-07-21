import type { Order } from '@/protocol/eip712'

import type { Hex } from './shared/eth'
import type { NFTCollection } from './nft-collection'
import { NFT } from './nft'

export type ListingStatus = 'active' | 'filled' | 'cancelled' | 'expired'

export type Listing = {
  id: string

  chainId: number
  orderHash: Hex

  side: 'ask' | 'bid'
  isCollectionBid: boolean

  collection: Hex
  tokenId: bigint

  price: bigint
  currency: Hex

  actor: Hex

  start: number
  end: number

  nftCollection?: NFTCollection
  nft?: NFT

  rawOrder: Order

  status: ListingStatus

  // txHash is only defined when status is not active
  // onchain statu changes:
  // cancellation
  // filled (settlement txHash)
  txHash?: Hex

  createdAt: number
}
