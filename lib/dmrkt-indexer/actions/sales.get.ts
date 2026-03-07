import type { Result } from '@/lib/utils/result'
import { DMRKT_INDEXER_BASE_URL as baseUrl } from '../constants'

import type { Sale } from '@/domain/sale'

export type PaginatedSales = {
  items: Sale[]
  nextCursor: string | null
}

export async function getSales(query = 'limit=50'): Promise<Result<PaginatedSales>> {
  const url = `${baseUrl}/api/settlements?${query}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
    return {
      ok: true,
      data: {
        items: data.items as Sale[],
        nextCursor: data.nextCursor,
      },
    }
  } catch (err) {
    return { ok: false, error: `Error getting sales: ${err}` }
  }
}
