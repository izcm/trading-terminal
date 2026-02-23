import { Order } from '@/lib/blockchain'
import { Hex } from 'viem'

export type OrderRecord = {
  chainId: number
  orderHash: Hex

  order: Order
  status: string

  updatedAt: number
  createdAt: number
}
