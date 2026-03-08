import { Hex } from '../../types/eth'

const truncateHex = (hex: Hex) => `${hex.slice(0, 6)}…${hex.slice(-4)}`

export const shortAddr = truncateHex
