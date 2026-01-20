export type Hex32 = `0x${string}` // convention

const truncateHex = (hex: Hex32) => `${hex.slice(1, 5)}..${hex.slice(-3)}`

export const addrDisplay = truncateHex
