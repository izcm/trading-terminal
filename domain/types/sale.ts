import type { Hex } from 'viem'

export const saleKey = (chainId: number, orderHash: Hex) => `${chainId}:${orderHash}` as const

export type Sale = {
  chainId: number
  orderHash: string

  collection: Hex
  tokenId: string

  seller: Hex
  buyer: Hex

  currency: Hex
  price: string

  order?: {
    side: 'ASK' | 'BID' | 'COLLECTION_BID'
    signer: Hex
  }

  metaStatus: 'PENDING' | 'DONE' | 'FAILED'
  execution: Execution
}

type Execution = {
  logIndex: number
  block: {
    timestamp: number
    number: number
  }
  tx: Tx
}

type Tx = {
  hash: Hex
  ctx?: {
    index: number
    gasUsed: string
    function: {
      selector: Hex
      name: string
    }
  }
}
