import { Result } from '@/types/core/result'

import type { Sale, Settlement } from '@/types/sale'
import { normalizeSettlement } from '@/types/sale'

import { DMRKT_INDEXER_BASE_URL as baseUrl } from '../constants'

export const getSales = async (): Promise<Result<Sale[]>> => {
  const url = `${baseUrl}/api/settlements`

  try {
    const res = await fetch(url)
    const data = await res.json()

    const sales = data.map((item: Settlement) => normalizeSettlement(item))
    return { ok: true, data: sales }
  } catch (err) {
    return { ok: false, error: `Error getting sales: ${err}` }
  }
}
