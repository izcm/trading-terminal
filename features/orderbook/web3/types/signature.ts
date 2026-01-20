import type { Hex32 } from '@/lib/utils/format/hex32'

export type Signature = {
  v: number
  r: Hex32
  s: Hex32
}
