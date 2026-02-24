export const orderFields = [
  { name: 'side', type: 'uint8' },
  { name: 'actor', type: 'address' },
  { name: 'isCollectionBid', type: 'bool' },
  { name: 'collection', type: 'address' },
  { name: 'tokenId', type: 'uint256' },
  { name: 'price', type: 'uint256' },
  { name: 'currency', type: 'address' },
  { name: 'start', type: 'uint64' },
  { name: 'end', type: 'uint64' },
  { name: 'nonce', type: 'uint256' },
] as const

export const eip712Types = {
  Order: orderFields,
} as const
