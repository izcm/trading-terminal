import type { Hex32 } from '@/lib/utils/format/hex32'

export type Sale = {
  orderHash: string
  collection: Hex32
  tokenId: string
  seller: Hex32
  buyer: Hex32
  currency: Hex32
  price: string
  txHash: Hex32
  timestamp: number
  blocknumber: number
}
