import type { Hex } from 'viem'

export type Order = {
  side: number
  actor: Hex
  isCollectionBid: boolean
  collection: Hex
  tokenId: bigint
  price: bigint
  currency: Hex
  start: bigint
  end: bigint
  nonce: bigint
}
