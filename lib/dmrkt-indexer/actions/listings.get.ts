import type { Listing } from '@/lib/dmrkt-indexer/types/listing'
import type { Result } from '@/lib/utils/result'
import { DMRKT_INDEXER_BASE_URL as baseUrl } from '../constants'

export type PaginatedListings = {
  items: Listing[]
  nextCursor: string | null
}

export async function getListings(query = 'limit=50'): Promise<Result<PaginatedListings>> {
  const url = `${baseUrl}/api/orders?${query}&include=nftCollection`

  try {
    const res = await fetch(url)
    const data = await res.json()

    const withId = (data.items as Listing[]).map(i => ({ ...i, id: `${i.chainId}:${i.orderHash}` }))

    return {
      ok: true,
      data: {
        items: withId,
        nextCursor: data.nextCursor,
      },
    }
  } catch (err) {
    return { ok: false, error: `Error getting listings: ${err}` }
  }
}
