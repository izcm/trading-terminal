import type { Sale } from '@/domain/types'
import type { Hex } from 'viem'

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
    chainId: s.chainId,
    orderHash: s.orderHash,

    collection: s.collection,
    tokenId: s.tokenId,

    seller: s.seller,
    buyer: s.buyer,

    currency: s.currency,
    price: s.price,

    order: s.orderAttributes
      ? {
          side: s.orderAttributes.type,
          signer: s.orderAttributes.signer,
        }
      : undefined,

    execution: {
      logIndex: s.execution.logIndex,

      block: {
        timestamp: s.execution.block.timestamp * 1000,
        number: s.execution.block.number,
      },

      tx: {
        hash: s.execution.txHash,

        ctx: s.execution.txContext
          ? {
              index: s.execution.txContext.index,
              gasUsed: s.execution.txContext.gasUsed,
              function: {
                selector: s.execution.txContext.functionSelector,
                name: s.execution.txContext.functionName,
              },
            }
          : undefined,
      },
    },

    metaStatus: s.metaStatus,
  }
}
