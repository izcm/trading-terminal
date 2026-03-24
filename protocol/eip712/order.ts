import type { Hex } from '@/domain/shared/eth'

export function orderType(order: Order) {
  return order.side === 0 ? 'ask' : 'bid'
}

export enum OrderSide {
  ASK = 0,
  BID = 1,
}

export type Fill = {
  actor: Hex
  tokenId: bigint
}

export type OrderCore = {
  side: OrderSide
  actor: Hex
  isCollectionBid: boolean
  collection: Hex
  tokenId: string
  price: string
  currency: Hex
  start: number
  end: number
  nonce: string
}

export type Order = OrderCore & {
  signature: {
    v: number
    r: Hex
    s: Hex
  }
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
