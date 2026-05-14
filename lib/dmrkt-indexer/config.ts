export function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_INDEXER_API
  if (!url) throw new Error('Missing NEXT_PUBLIC_INDEXER_API')
  return url
}

export function getWsUrl() {
  const url = process.env.NEXT_PUBLIC_INDEXER_WS
  if (!url) throw new Error('Missing NEXT_PUBLIC_INDEXER_WS')
  return url
}
