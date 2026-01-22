import { Hex } from 'viem'
import { Sale } from '@/domain/types'

export type Settlement = {
  orderHash: string
  collection: Hex
  tokenId: string
  seller: Hex
  buyer: Hex
  currency: Hex
  priceWei: string
  txHash: Hex

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
