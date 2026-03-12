import type { Order } from '@/protocol/eip712'

import type { Hex } from './shared/types/eth'
import type { NFTCollection } from '@/lib/dmrkt-indexer/types/nft-collection'
import type { NFT } from './nft'

export type Listing = {
  id: string

  chainId: number
  orderHash: Hex

  type: 'ask' | 'bid'
  isCollectionBid: boolean

  collection: Hex
  tokenId: bigint

  price: bigint
  currency: Hex

  actor: Hex

  start: number
  end: number

  nftCollection?: NFTCollection | null
  nft?: NFT | null

  rawOrder: Order

  status: string
}
