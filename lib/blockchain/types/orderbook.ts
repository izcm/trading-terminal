import type { Hex32 } from '@/lib/utils/format/hex32'

export type Order = {
  side: number
  actor: Hex32
  isCollectionBid: boolean
  collection: Hex32
  tokenId: bigint
  price: bigint
  currency: Hex32
  start: bigint
  end: bigint
  nonce: bigint
}

export type Signature = {
  v: number
  r: `0x${string}`
  s: `0x${string}`
}

export type Fill = {
  actor: `0x${string}`
  tokenId: bigint
}
