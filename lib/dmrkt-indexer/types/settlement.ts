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

  txContext?: {
    txIndex: number
    functionSelector: string
    functionName: string
    contractAddress: string
    gasUsed: number
    gasPrice: number
  }

  nftCollection?: NFTCollectionDTO | null
  order?: OrderDTO | null
}

export function toSale(dto: SettlementDTO): Sale {
  console.log(dto)
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

    listing: dto.order ? toListing(dto.order) : null,

    txContext: dto.txContext
      ? {
          txIndex: dto.txContext.txIndex,

          functionSelector: dto.txContext.functionSelector as `0x${string}`,
          functionName: dto.txContext.functionName,
          contractAddress: dto.txContext.contractAddress as `0x${string}`,

          gasUsed: dto.txContext.gasUsed,
          gasPrice: dto.txContext.gasPrice,
        }
      : undefined,
  }
}
