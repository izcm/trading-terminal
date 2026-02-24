import { Result } from '@/lib/utils/http'
import { ListingDTO } from '@/lib/dmrkt-indexer/types/listing'

import { DMRKT_INDEXER_BASE_URL as baseUrl } from '../constants'

export type PaginatedListings = {
  items: ListingDTO[]
  nextCursor: string | null
}
export async function getListings(query = 'limit=50'): Promise<Result<PaginatedListings>> {
  const url = `${baseUrl}/api/orders?${query}&include=collection`

  try {
    const res = await fetch(url)
    const data = await res.json()

    return {
      ok: true,
      data: {
        items: data.items,
        nextCursor: data.nextCursor,
      },
    }
  } catch (err) {
    return { ok: false, error: `Error getting listings: ${err}` }
  }
}
