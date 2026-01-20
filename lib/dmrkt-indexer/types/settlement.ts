import { Hex32 } from '@/lib/utils/format/hex32'
import { Sale } from '@/domain/types'

export type Settlement = {
  orderHash: string
  collection: Hex32
  tokenId: string
  seller: Hex32
  buyer: Hex32
  currency: Hex32
  priceWei: string
  txHash: Hex32

  // metadata
  block: {
    number: number
    timestamp: number
    logIndex: number
  }
}

export const settlementToSale = (s: Settlement): Sale => {
  return {
    orderHash: s.orderHash,
    collection: s.collection,
    tokenId: s.tokenId,
    seller: s.seller,
    buyer: s.buyer,
    currency: s.currency,
    price: s.priceWei,
    txHash: s.txHash,
    timestamp: s.block.timestamp * 1000,
    blocknumber: s.block.number,
  }
}
