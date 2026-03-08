import type { Hex } from '@/domain/shared/types/eth'
import type { Sale } from '@/domain/sale'

export type SettlementDoc = {
  _id: string

  chainId: number
  orderHash: Hex

  collection: Hex
  tokenId: string

  seller: Hex
  buyer: Hex

  currency: Hex
  price: string

  execution: {
    logIndex: number
    txHash: Hex

    block: {
      number: number
      timestamp: number
    }

    txContext?: {
      index: number
      gasUsed: string
      effectiveGasPrice: string
      functionSelector: Hex
      functionName: string
      contractAddress: Hex
    }
  }

  metaStatus: 'PENDING' | 'DONE' | 'FAILED'
  orderAttributes?: {
    type: 'ASK' | 'BID' | 'COLLECTION_BID'
    signer: Hex
  }
}

export const settlementDocToSale = (s: SettlementDoc): Sale => {
  return {
    id: `${s.chainId}:${s.orderHash}`,
    chainId: s.chainId,
    orderHash: s.orderHash,
    txHash: s.execution.txHash,

    collection: s.collection,
    tokenId: s.tokenId,

    seller: s.seller,
    buyer: s.buyer,

    currency: s.currency,
    price: s.price,

    blockNumber: s.execution.block.number,
    timestamp: s.execution.block.timestamp * 1000,

    logIndex: s.execution.logIndex,
  }
}
