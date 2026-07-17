/**
 * BaseUrl for dmrkt indexer
 *
 * For the dmrkt demo, all services run in Docker, including this frontend.
 * Server components run inside the container and must use the internal
 * Docker network address (e.g. http://indexer:5000) to reach the indexer.
 *
 * Browser fetches can't reach the internal Docker address, only localhost.
 *
 * window undefined → INDEXER_API_SERVER (internal Docker hostname)
 * window defined  → NEXT_PUBLIC_INDEXER_API_CLIENT (localhost)
 */
export function getBaseUrl() {
  if (typeof window === 'undefined') {
    const url = process.env.INDEXER_API_SERVER
    if (!url) throw new Error('Missing INDEXER_API_SERVER')
    return url
  }
  const url = process.env.NEXT_PUBLIC_INDEXER_API_CLIENT
  if (!url) throw new Error('Missing NEXT_PUBLIC_INDEXER_API_CLIENT')
  return url
}

export function getWsUrl() {
  const url = process.env.NEXT_PUBLIC_INDEXER_WS
  if (!url) throw new Error('Missing NEXT_PUBLIC_INDEXER_WS')
  return url
}
