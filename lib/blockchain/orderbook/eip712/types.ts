import type { Hex } from 'viem'

export type Fill = {
  actor: Hex
  tokenId: bigint
}

export type OrderRecord = {
  chainId: number
  orderHash: Hex

  order: Order
  status: string

  updatedAt: number
  createdAt: number
}

export type Order = OrderCore & {
  signature: {
    v: number
    r: Hex
    s: Hex
  }
}

type OrderCore = {
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

type OrderCore712 = {
  side: number
  isCollectionBid: boolean
  collection: Hex
  tokenId: bigint
  currency: Hex
  price: bigint
  actor: Hex
  start: bigint
  end: bigint
  nonce: bigint
}

export const toOrder712 = (order: OrderCore): OrderCore712 => ({
  side: order.side,
  isCollectionBid: order.isCollectionBid,
  collection: order.collection,
  tokenId: BigInt(order.tokenId),
  currency: order.currency,
  price: BigInt(order.price),
  actor: order.actor,
  start: BigInt(order.start),
  end: BigInt(order.end),
  nonce: BigInt(order.nonce),
})
