import type { Hex } from 'viem'

export type Sale = {
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

  execution: Execution
}

type Execution = {
  chainId: number
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
