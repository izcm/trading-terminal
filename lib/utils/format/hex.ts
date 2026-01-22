import type { Hex } from 'viem'

const truncateAddr = (hex: Hex) => `${hex.slice(1, 5)}..${hex.slice(-3)}`

export const addrDisplay = truncateAddr
