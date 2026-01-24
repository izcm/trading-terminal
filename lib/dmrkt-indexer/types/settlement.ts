import { Hex } from 'viem'
import { Sale } from '@/domain/types'

export type SettlementDoc = {
  _id: string

  orderHash: Hex
  collection: Hex
  tokenId: string

  seller: Hex
  buyer: Hex
  currency: Hex
  priceWei: string

  execution: {
    chainId: number
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

  orderMeta?: {
    side: 'ASK' | 'BID' | 'COLLECTION_BID'
    signer: Hex
  }
}

export const settlementDocToSale = (s: SettlementDoc): Sale => {
  return {
    orderHash: s.orderHash,
    collection: s.collection,
    tokenId: s.tokenId,
    seller: s.seller,
    buyer: s.buyer,
    currency: s.currency,
    price: s.priceWei,

    order: s.orderMeta
      ? {
          side: s.orderMeta.side,
          signer: s.orderMeta.signer,
        }
      : undefined,

    execution: {
      chainId: s.execution.chainId,
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
  }
}
