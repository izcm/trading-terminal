import type { Hex } from 'viem'

export type Sale = {
  orderHash: string
  collection: Hex
  tokenId: string
  seller: Hex
  buyer: Hex
  currency: Hex
  price: string
  txHash: Hex
  timestamp: number
  blocknumber: number
}
