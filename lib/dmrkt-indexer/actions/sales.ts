import { Result } from '@/data/types/core/result'

import type { Sale, Settlement } from '@/data/types/sale'
import { settlementToSale } from '@/data/types/sale'

import { DMRKT_INDEXER_BASE_URL as baseUrl } from '../constants'

export type PaginatedSales = {
  items: Sale[]
  nextCursor: string | null
}

export const getSales = async (query = 'limit=50'): Promise<Result<PaginatedSales>> => {
  const url = `${baseUrl}/api/settlements?${query}`

  try {
    const res = await fetch(url)
    const data = await res.json()

    return {
      ok: true,
      data: {
        items: data.items.map((item: Settlement) => settlementToSale(item)),
        nextCursor: data.nextCursor,
      },
    }
  } catch (err) {
    return { ok: false, error: `Error getting sales: ${err}` }
  }
}
