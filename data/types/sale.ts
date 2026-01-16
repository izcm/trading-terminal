// TODO: settlement type should be imported from /packages repo (exported from indexer repo)

export type Sale = {
  orderHash: string
  collection: `0x${string}`
  tokenId: string
  seller: `0x${string}`
  buyer: `0x${string}`
  currency: `0x${string}`
  price: string
  txHash: string
  timestamp: number
  blocknumber: number
}

export type Settlement = {
  orderHash: string
  collection: `0x${string}`
  tokenId: string
  seller: `0x${string}`
  buyer: `0x${string}`
  currency: `0x${string}`
  priceWei: string
  txHash: string

  // metadata
  block: {
    number: number
    timestamp: number
    logIndex: number
  }
}

export const settlementToSale = (s: Settlement): Sale => {
  return {
    orderHash: s.orderHash,
    collection: s.collection,
    tokenId: s.tokenId,
    seller: s.seller,
    buyer: s.buyer,
    currency: s.currency,
    price: s.priceWei,
    txHash: s.txHash,
    timestamp: s.block.timestamp * 1000,
    blocknumber: s.block.number,
  }
}
