// Maps snake_case / all-lowercase input to the correct camelCase field name
// Covers all fields present in ListingDetails and TradeDetails (and their domain types)

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

  // trade-specific
  blocknumber: 'blockNumber',
  block_number: 'blockNumber',
  logindex: 'logIndex',
  log_index: 'logIndex',

  // ui aliases
  maker: 'actor',

  // sort params
  sortfield: 'sortField',
  sort_field: 'sortField',
  sortdir: 'sortDir',
  sort_dir: 'sortDir',
}

export function resolveFieldName(input: string): string {
  return FIELD_NAME_MAP[input.toLowerCase()] ?? input
}
