import { Order } from '@/features/orderbook/web3/types/order'
import { Hex } from 'viem'

export type OrderStatus = 'active' | 'filled' | 'cancelled' | 'expired'

export type OrderType = 'ask' | 'bid'

export type Listing = {
  chainId: number
  orderHash: Hex

  type: OrderType

  collection: {
    name: string
    symbol: string
  }
  tokenId: string

  price: string
  currency: Hex

  start: string
  end: string

  actor: Hex
  nonce: string

  rawOrder: Order
}
