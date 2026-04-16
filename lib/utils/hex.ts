export const truncateHex = (hex: `0x${string}`) => `${hex.slice(0, 4)}…${hex.slice(-4)}`

export const addrShort = truncateHex
