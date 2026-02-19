import type { Hex } from 'viem'

export type Signature = {
  v: number
  r: Hex
  s: Hex
}

export type OrderRecord = {
  chainId: number
  orderHash: Hex

  order: Order
  status: string

  updatedAt: number
  createdAt: number
}

export type Order = {
  side: number
  actor: Hex
  isCollectionBid: boolean
  collection: Hex
  tokenId: string
  price: string
  currency: Hex
  start: string
  end: string
  nonce: string
}
