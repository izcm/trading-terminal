import type { Hex } from 'viem'
import type { Listing } from '@/domain/types/listing'

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

export const orderRecordToListing = (o: OrderRecord): Listing => {
  return {
    chainId: o.chainId,
    orderHash: o.orderHash,
    type: o.order.side === 0 ? 'ask' : 'bid',
    collection: o.order.collection,
    tokenId: o.order.tokenId,
    price: o.order.price,
    currency: o.order.currency,
    start: o.order.start,
    end: o.order.end,
    actor: o.order.actor,
    nonce: o.order.nonce,

    rawOrder: o.order,
  }
}
