import type { Hex } from '@/domain/shared/types/eth'

const truncateHex = (hex: Hex) => `${hex.slice(0, 6)}…${hex.slice(-4)}`

export const shortAddr = truncateHex
