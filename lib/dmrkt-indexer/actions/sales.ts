import { Result } from '@/lib/utils/result'

import { settlementToSale } from '../types/settlement'

import type { Settlement } from '../types/settlement'
import type { Sale } from '@/domain/types/sale'

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
