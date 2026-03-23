import type { Hex } from '@/domain/shared/eth'
import type { Sale } from '@/domain/sale'

import { type NFTCollectionDTO, toNFTCollection } from './nft-collection'
import { type OrderDTO, toListing } from './order'

export type SettlementDTO = {
  id: string
  chainId: number
  orderHash: Hex
  txHash: Hex

  collection: Hex
  tokenId: string

  seller: Hex
  buyer: Hex

  currency: Hex
  price: string

  blockNumber: number
  timestamp: number

  logIndex: number

  callReconstructed: boolean
  txInputs?: {
    order?: {
      signer: Hex
      collection: Hex
      tokenId: string
      currency: Hex
      price: string
      start: string
      end: string
      nonce: string
    }
    fill?: {
      tokenId: string
      actor: Hex
    }
    gasUsed?: string
    gasPrice?: string
  }

  nftCollection?: NFTCollectionDTO | null
  order?: OrderDTO | null
}

export function toSale(dto: SettlementDTO): Sale {
  return {
    id: dto.id,
    chainId: dto.chainId,

    orderHash: dto.orderHash,
    txHash: dto.txHash,

    collection: dto.collection,
    tokenId: BigInt(dto.tokenId),

    seller: dto.seller,
    buyer: dto.buyer,

    currency: dto.currency,
    price: BigInt(dto.price),

    blockNumber: dto.blockNumber,
    timestamp: dto.timestamp,

    logIndex: dto.logIndex,

    nftCollection: dto.nftCollection ? toNFTCollection(dto.nftCollection) : null,

    order: dto.order ? toListing(dto.order) : null,
  }
}
