import type { Order } from '@/protocol/eip712'

import type { Hex } from '@/domain/shared/eth'
import type { NFT } from '@/domain/nft'
import type { Listing } from '@/domain/listing'

import { toNFTCollection, type NFTCollectionDTO } from './nft-collection'

export type ListingDTO = {
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

  nftCollection?: NFTCollectionDTO | null
  nft?: NFT | null

  // raw order for contract interaction
  rawOrder: Order

  status: string
}

export function toListing(dto: ListingDTO): Listing {
  return {
    ...dto,
    nftCollection: dto.nftCollection ? toNFTCollection(dto.nftCollection) : dto.nftCollection,
    tokenId: BigInt(dto.tokenId),
    price: BigInt(dto.price),
  }
}
