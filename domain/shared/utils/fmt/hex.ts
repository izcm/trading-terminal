import { Hex } from '../../eth'

export const truncateHex = (hex: Hex) => `${hex.slice(0, 6)}…${hex.slice(-4)}`

export const addrShort = truncateHex
