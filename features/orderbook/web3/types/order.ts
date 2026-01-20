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
