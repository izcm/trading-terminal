import type { Hex } from 'viem'

export type Signature = {
  v: number
  r: Hex
  s: Hex
}
