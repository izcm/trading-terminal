import { Result } from '@/types/core/result'

import { DMRKT_INDEXER_BASE_URL as baseUrl } from '../constants'

export const getSales = async () => {
  const url = `${baseUrl}/api/settlements`

  try {
    const res = await fetch(url)
    const data = await res.json()
    return { ok: true, data }
  } catch (err) {
    return { ok: false, error: `Error getting sales: ${err}` }
  }
}
