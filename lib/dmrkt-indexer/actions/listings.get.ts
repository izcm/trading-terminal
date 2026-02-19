import { Result } from '@/lib/utils/result'

import { OrderRecord, orderRecordToListing } from '@/features/orderbook/web3/types/order'
import { Listing } from '@/domain/types/listing'

import { DMRKT_INDEXER_BASE_URL as baseUrl } from '../constants'

export type PaginatedListings = {
  items: Listing[]
  nextCursor: string | null
}
export async function getListings(query = 'limit=50'): Promise<Result<PaginatedListings>> {
  const url = `${baseUrl}/api/orders?${query}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    return {
      ok: true,
      data: {
        items: data.items.map((item: OrderRecord) => orderRecordToListing(item)),
        nextCursor: data.nextCursor,
      },
    }
  } catch (err) {
    return { ok: false, error: `Error getting listings: ${err}` }
  }
}
