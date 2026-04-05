// Maps snake_case / all-lowercase input to the correct camelCase field name
// Covers all fields present in ListingDetails and SaleDetails (and their domain types)

export const FIELD_NAME_MAP: Record<string, string> = {
  // shared
  tokenid: 'tokenId',
  token_id: 'tokenId',
  orderhash: 'orderHash',
  order_hash: 'orderHash',
  txhash: 'txHash',
  tx_hash: 'txHash',
  chainid: 'chainId',
  chain_id: 'chainId',

  // listing-specific
  iscollectionbid: 'isCollectionBid',
  is_collection_bid: 'isCollectionBid',

  // sale-specific
  blocknumber: 'blockNumber',
  block_number: 'blockNumber',
  logindex: 'logIndex',
  log_index: 'logIndex',

  // single-word fields (included for completeness / uniform lookup)
  price: 'price',
  side: 'side',
  actor: 'actor',
  maker: 'maker',
  status: 'status',
  expires: 'expires',
  collection: 'collection',
  currency: 'currency',
  buyer: 'buyer',
  seller: 'seller',
  timestamp: 'timestamp',
  start: 'start',
  end: 'end',
}

export function resolveFieldName(input: string): string {
  return FIELD_NAME_MAP[input.toLowerCase()] ?? input
}
